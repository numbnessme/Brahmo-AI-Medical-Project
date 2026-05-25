import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Patient, DatabaseDrug, SafetyAlert, CrossReactivityRule } from '../lib/types';
import { 
  calculateEGFR, 
  calculateChadsVasc, 
  checkAllergyConflicts, 
  checkRenalDosing, 
  generateSystemConstraintText
} from '../lib/safety-engine';

declare var process: any;

// --- SAFE MULTI-ENVIRONMENT TOKEN COUPLING LAYER ---
// Intercepts environment mappings from Vite browser contexts OR standard Node process contexts safely
const supabaseUrl = 
  (typeof import.meta.env !== 'undefined' && import.meta.env.VITE_SUPABASE_URL) || 
  (typeof process !== 'undefined' && process.env.VITE_SUPABASE_URL) || 
  'https://placeholder.supabase.co';

const supabaseAnonKey = 
  (typeof import.meta.env !== 'undefined' && import.meta.env.VITE_SUPABASE_ANON_KEY) || 
  (typeof process !== 'undefined' && process.env.VITE_SUPABASE_ANON_KEY) || 
  'placeholder-key';

const llmApiKey = 
  (typeof import.meta.env !== 'undefined' && import.meta.env.VITE_LLM_API_KEY) || 
  (typeof process !== 'undefined' && process.env.VITE_LLM_API_KEY) || 
  '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface DrugSafetyContextType {
  patients: Patient[];
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient) => void;
  activeAlerts: SafetyAlert[];
  isProcessingCheck: boolean;
  runSafetyPipeline: (newDrugName: string) => Promise<{ systemConstraintText: string; alerts: SafetyAlert[] }>;
  callLiveAI: (drug: string, question: string, constraints: string, mode: 'GENERIC' | 'SHIELDED') => Promise<string>;
  currentEGFR: number;
  currentChadsVasc: number;
}

const DrugSafetyContext = createContext<DrugSafetyContextType | undefined>(undefined);

export const DrugSafetyProvider: React.FC<{ children: React.ReactNode, mockPatients: Patient[] }> = ({ children, mockPatients }) => {
  const [patients] = useState<Patient[]>(mockPatients || []);
  const [selectedPatient, setSelectedPatientState] = useState<Patient | null>(null);
  const [activeAlerts, setActiveAlerts] = useState<SafetyAlert[]>([]);
  const [isProcessingCheck, setIsProcessingCheck] = useState<boolean>(false);
  const [currentEGFR, setCurrentEGFR] = useState<number>(0);
  const [currentChadsVasc, setCurrentChadsVasc] = useState<number>(0);

  useEffect(() => {
    if (patients?.length > 0 && !selectedPatient) {
      setSelectedPatientState(patients[0]);
    }
  }, [patients, selectedPatient]);

//  REPLACE IT WITH THIS VERSION:
useEffect(() => {
  if (selectedPatient) {
    // Dynamically re-calculates kidney functions via CKD-EPI 2021 equations
    const egfr = calculateEGFR({
      creatinine: selectedPatient.labs.creatinine,
      age: selectedPatient.age,
      gender: selectedPatient.gender
    });
    
    // Dynamically re-calculates cardiovascular stroke risk scores
    const chads = calculateChadsVasc(selectedPatient.age, selectedPatient.gender, selectedPatient.conditions);
    
    // Pushes the updated values directly into your dashboard view states
    setCurrentEGFR(egfr);
    setCurrentChadsVasc(chads.score);
    setActiveAlerts([]); 
  }
}, [selectedPatient]); // <──  THE MAGIC FIX! Adding this tells React to listen for sidebar clicks.

  const setSelectedPatient = (patient: Patient) => {
    setSelectedPatientState(patient);
  };

  /**
   * Deterministic Evaluation Pipeline
   */
  const runSafetyPipeline = useCallback(async (newDrugName: string) => {
    if (!selectedPatient) throw new Error("No active patient tracking selection.");
    
    setIsProcessingCheck(true);
    const compiledAlerts: SafetyAlert[] = [];
    const normalizedQueryName = newDrugName.toLowerCase().replace(/[^a-z0-9]/g, '');

    try {
      const [crossReactivityRes, targetsRes] = await Promise.all([
        supabase.from('allergy_cross_reactivity').select('*'),
        supabase.from('drugs').select('*').eq('generic_name_normalized', normalizedQueryName)
      ]);

      const crossReactivityRules = (crossReactivityRes.data || []) as CrossReactivityRule[];
      const targetDrug: DatabaseDrug | null = targetsRes.data?.[0] || null;

      if (!targetDrug) {
        const unknownAlert: SafetyAlert = {
          type: 'RENAL',
          severity: 'HIGH',
          title: '⚠️ UNKNOWN COMPOUND DETECTED',
          message: `"${newDrugName}" was not found in the safety database. Guardrails bypassed. Proceed with absolute manual caution.`,
          overrideStrategy: 'Requires physician clinical validation.'
        };
        setIsProcessingCheck(false);
        return { systemConstraintText: unknownAlert.message, alerts: [unknownAlert] };
      }

      const renalAlerts = checkRenalDosing(
        { genericName: targetDrug.generic_name, renalDosing: targetDrug.renal_dosing },
        currentEGFR
      );
      compiledAlerts.push(...renalAlerts);

      const allergyAlerts = checkAllergyConflicts(
        { genericName: targetDrug.generic_name, drugClass: targetDrug.drug_class },
        selectedPatient.allergies || [],
        crossReactivityRules
      );
      compiledAlerts.push(...allergyAlerts);

      if (selectedPatient.medications?.length > 0) {
        const activeMedsNormalized = selectedPatient.medications.map(m => m.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, ''));

        const { data: ddiMatches } = await supabase
          .from('drug_interactions')
          .select(`
            severity, mechanism, clinical_effect, management,
            drug_a:drug_a_id(generic_name, generic_name_normalized),
            drug_b:drug_b_id(generic_name, generic_name_normalized)
          `)
          .or(`drug_a_id.eq.${targetDrug.id},drug_b_id.eq.${targetDrug.id}`);

        if (ddiMatches) {
          ddiMatches.forEach((match: any) => {
            const drugAName = match.drug_a?.generic_name;
            const drugBName = match.drug_b?.generic_name;
            const normA = match.drug_a?.generic_name_normalized;
            const normB = match.drug_b?.generic_name_normalized;

            const comparisonPartnerNorm = normA === targetDrug.generic_name_normalized ? normB : normA;
            const humanPartnerName = normA === targetDrug.generic_name_normalized ? drugBName : drugAName;

            if (activeMedsNormalized.includes(comparisonPartnerNorm)) {
              compiledAlerts.push({
                type: 'INTERACTION',
                severity: match.severity === 'CONTRAINDICATED' || match.severity === 'SEVERE' ? 'CRITICAL' : 'MODERATE',
                title: `${match.severity === 'SEVERE' || match.severity === 'CONTRAINDICATED' ? '⛔' : '⚠️'} DDI: ${targetDrug.generic_name} + ${humanPartnerName}`,
                message: `Mechanism: ${match.mechanism}. Effect: ${match.clinical_effect}. Management: ${match.management}`,
                overrideStrategy: match.severity === 'CONTRAINDICATED' ? 'CRITICAL NON-OVERRIDABLE BLOCK' : 'Requires clinical adjustment.'
              });
            }
          });
        }
      }

      setActiveAlerts(compiledAlerts);
      
      const constraintPayload = generateSystemConstraintText(
        selectedPatient.name,
        { eGFR: currentEGFR, chadsVasc: currentChadsVasc },
        compiledAlerts
      );

      setIsProcessingCheck(false);
      return { systemConstraintText: constraintPayload, alerts: compiledAlerts };

    } catch (error) {
      setIsProcessingCheck(false);
      console.error("Pipeline failure:", error);
      return { systemConstraintText: "Error processing engine safety checks.", alerts: [] };
    }
  }, [selectedPatient, currentEGFR, currentChadsVasc]);

/**
   * LIVE AI ORCHESTRATION ENGINE (Safe Browser-Compliant Channel)
   */
  const callLiveAI = useCallback(async (
    drug: string, 
    question: string, 
    constraints: string, 
    mode: 'GENERIC' | 'SHIELDED'
  ): Promise<string> => {
    const apiKey = import.meta.env.VITE_LLM_API_KEY || llmApiKey; // Added fallback to existing llmApiKey var just in case

    // Compile the context message
    const systemPrompt = mode === 'SHIELDED' 
      ? `${constraints}\n\nYou are a clinical safety intercept layer. If a safety conflict is provided above, you MUST explicitly state that the prescription is BLOCKED and outline the safety reason clearly.`
      : "You are a helpful medical assistant chatbot assistant thread. Answer the question directly.";

    try {
      // 💡 Pointing to Groq's official OpenAI-compatible endpoint route
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}` // Reads your gsk_ key from env
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", // ⚡ A fast, free reasoning model
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Patient Context Check: Regarding prescribing ${drug}. Doctor asks: ${question}` }
          ],
          temperature: mode === 'SHIELDED' ? 0.1 : 0.7 // Low temp enforces strict safety rules
        })
      });

      const json = await response.json();
      return json.choices?.[0]?.message?.content || "No message content generated.";

    } catch (err) {
      console.error("Groq Network Loop Fail:", err);
      return "Failed to fetch remote stream data content from Groq infrastructure cloud.";
    }
  }, []);

  return (
    <DrugSafetyContext.Provider value={{
      patients,
      selectedPatient,
      setSelectedPatient,
      activeAlerts,
      isProcessingCheck,
      runSafetyPipeline,
      callLiveAI,
      currentEGFR,
      currentChadsVasc
    }}>
      {children}
    </DrugSafetyContext.Provider>
  );
};

export const useDrugSafety = () => {
  const context = useContext(DrugSafetyContext);
  if (!context) throw new Error("useDrugSafety hook executed outside an active DrugSafetyProvider root node.");
  return context;
};