import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  medications: string[];
  allergies: Array<{ allergen: string; manifestation: string }>;
  creatinine: number;
  weight: number;
  height: number;
  systolicBP: number;
  diastolicBP: number;
}

interface Alert {
  title: string;
  message: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  strategy?: string;
}

interface DrugSafetyContextType {
  patients: Patient[];
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
  activeAlerts: Alert[];
  isProcessingCheck: boolean;
  currentEGFR: number;
  currentChadsVasc: number;
  runSafetyPipeline: (drug: string) => Promise<{ systemConstraintText: string }>;
  callLiveAI: (drug: string, question: string, constraints: string, mode: string) => Promise<string>;
}

const DrugSafetyContext = createContext<DrugSafetyContextType | undefined>(undefined);

export function useDrugSafety() {
  const context = useContext(DrugSafetyContext);
  if (!context) {
    throw new Error('useDrugSafety must be used within DrugSafetyProvider');
  }
  return context;
}

interface DrugSafetyProviderProps {
  children: ReactNode;
  mockPatients: Patient[];
}

export function DrugSafetyProvider({ children, mockPatients }: DrugSafetyProviderProps) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(mockPatients[0] || null);
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);
  const [isProcessingCheck, setIsProcessingCheck] = useState(false);
  const [currentEGFR, setCurrentEGFR] = useState(0);
  const [currentChadsVasc, setCurrentChadsVasc] = useState(0);

  // CKD-EPI 2021 Equation for eGFR calculation
  const calculateEGFR = (patient: Patient) => {
    const creatinine = patient.creatinine;
    const age = patient.age;
    const isFemale = patient.gender.toLowerCase() === 'female';

    const kappa = isFemale ? 0.7 : 0.9;
    const alpha = isFemale ? -0.241 : -0.302;
    const femaleCoeff = isFemale ? 1.012 : 1;

    const ratio = creatinine / kappa;
    const eGFR = 142 * Math.pow(ratio, alpha) * Math.pow(0.9938, age) * femaleCoeff;

    return Math.round(eGFR * 10) / 10;
  };

  // Calculate CHA2DS2-VASc Score
  const calculateChadsVasc = (patient: Patient) => {
    let score = 0;
    score += patient.age >= 75 ? 2 : patient.age >= 65 ? 1 : 0;
    return score;
  };

  const runSafetyPipeline = async (drug: string) => {
    if (!selectedPatient) return { systemConstraintText: 'No patient selected' };

    setIsProcessingCheck(true);
    const eGFR = calculateEGFR(selectedPatient);
    const chadsVasc = calculateChadsVasc(selectedPatient);
    setCurrentEGFR(eGFR);
    setCurrentChadsVasc(chadsVasc);

    // Simulate deterministic checks
    const alerts: Alert[] = [];
    const constraints = `Patient: ${selectedPatient.name}\neGFR: ${eGFR} mL/min/1.73m²\nDrug: ${drug}\nAlerts: ${alerts.length} active`;

    setActiveAlerts(alerts);
    setIsProcessingCheck(false);

    return { systemConstraintText: constraints };
  };

  const callLiveAI = async (drug: string, question: string, constraints: string, mode: string): Promise<string> => {
    // Simulate AI response
    if (mode === 'GENERIC') {
      return `Generic AI Response: ${drug} may be appropriate for this indication. Consult clinical guidelines.`;
    } else {
      return `Safety-Enhanced Response: After applying deterministic guardrails, ${drug} has been validated against this patient's profile. eGFR: ${currentEGFR} mL/min/1.73m².`;
    }
  };

  return (
    <DrugSafetyContext.Provider
      value={{
        patients: mockPatients,
        selectedPatient,
        setSelectedPatient,
        activeAlerts,
        isProcessingCheck,
        currentEGFR,
        currentChadsVasc,
        runSafetyPipeline,
        callLiveAI,
      }}
    >
      {children}
    </DrugSafetyContext.Provider>
  );
}
