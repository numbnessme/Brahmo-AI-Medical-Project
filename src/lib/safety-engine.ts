// src/lib/safety-engine.ts
import { PatientLabs, PatientConditions, DrugDosingRule, SafetyAlert, CrossReactivityRule } from './types';

// --- 1. CLINICAL MATHEMATICAL CALCULATORS ---

/**
 * Computes estimated Glomerular Filtration Rate (eGFR) using the CKD-EPI (2021) equation.
 * Formula: eGFR = 142 × min(Scr/κ, 1)^α × max(Scr/κ, 1)^(-1.200) × 0.9938^Age × Multiplier
 */
export function calculateEGFR(labs: PatientLabs): number {
  const { creatinine, age, gender } = labs;
  const kappa = gender === 'female' ? 0.7 : 0.9;
  const alpha = gender === 'female' ? -0.241 : -0.302;
  const multiplier = gender === 'female' ? 1.012 : 1.0;

  const scrTermMin = Math.min(creatinine / kappa, 1);
  const scrTermMax = Math.max(creatinine / kappa, 1);

  const egfr = 142 * Math.pow(scrTermMin, alpha) * Math.pow(scrTermMax, -1.200) * Math.pow(0.9938, age) * multiplier;

  return Math.round(egfr * 10) / 10; // Precision rounding to 1 decimal point
}

/**
 * Computes the CHA₂DS₂-VASc Stroke Risk Score for Atrial Fibrillation.
 * Scoring Matrix: C(1) H(1) A2(2) D(1) S2(2) V(1) A(1) Sc(1)
 */
export function calculateChadsVasc(
  age: number, 
  gender: 'male' | 'female', 
  conditions: PatientConditions
): { score: number; text: string; anticoagulationRecommended: boolean } {
  let score = 0;

  if (conditions.hasCHF) score += 1;
  if (conditions.hasHTN) score += 1;
  if (conditions.hasDM) score += 1;
  if (conditions.hasStrokeOrTIA) score += 2;
  if (conditions.hasVascularDisease) score += 1;

  // Age Thresholds
  if (age >= 75) score += 2;
  else if (age >= 65) score += 1;

  // Biological Sex Category
  if (gender === 'female') score += 1;

  // Clinical Recommendations thresholds
  const thresholdM = 2;
  const thresholdF = 3;
  const isRecommended = (gender === 'male' && score >= thresholdM) || (gender === 'female' && score >= thresholdF);

  let guidanceText = `CHA₂DS₂-VASc Score: ${score}. `;
  if (isRecommended) {
    guidanceText += "Anticoagulation therapy is STRONGLY indicated due to high statistical ischemic stroke liability.";
  } else {
    guidanceText += "Anticoagulation presents low-to-moderate clinical utility baseline.";
  }

  return {
    score,
    text: guidanceText,
    anticoagulationRecommended: isRecommended
  };
}

// --- 2. DETERMINISTIC CORE SAFETY CHECKS ---

/**
 * Checks for direct and cross-reactive allergies across configured matrices
 */
export function checkAllergyConflicts(
  newDrug: { genericName: string; drugClass: string },
  patientAllergies: Array<{ allergen: string; manifestation: string; reactionType: string }>,
  crossReactivityRules: CrossReactivityRule[]
): SafetyAlert[] {
  const alerts: SafetyAlert[] = [];

  for (const allergy of patientAllergies) {
    const standardizedAllergen = allergy.allergen.toLowerCase().trim();
    const standardizedNewDrug = newDrug.genericName.toLowerCase().trim();

    // Direct Match Check
    if (standardizedNewDrug.includes(standardizedAllergen) || standardizedAllergen.includes(standardizedNewDrug)) {
      alerts.push({
        type: 'ALLERGY',
        severity: 'CRITICAL',
        title: `⛔ HARD BLOCK: Direct Allergy Match`,
        message: `Patient has documented allergy to ${allergy.allergen} (${allergy.manifestation}). Prescribing ${newDrug.genericName} is strictly blocked.`,
        overrideStrategy: 'NON-OVERRIDABLE CLINICAL BOUNDARY'
      });
      continue;
    }

    // Cross-Reactivity Match Check (Bi-directional fallback lookup)
    const crossRule = crossReactivityRules.find(
      rule => 
        (rule.drug_class_a === allergy.reactionType && rule.drug_class_b === newDrug.drugClass) ||
        (rule.drug_class_a === newDrug.drugClass && rule.drug_class_b === allergy.reactionType)
    );

    if (crossRule) {
      const pct = Number(crossRule.cross_reactivity_pct);
      const isAnaphylaxis = allergy.manifestation.toLowerCase().includes('anaphylaxis');
      
      let severity: 'CRITICAL' | 'HIGH' | 'MODERATE' = 'MODERATE';
      if (pct >= 50 || (allergy.reactionType === 'penicillin' && newDrug.drugClass === 'cephalosporin_1st' && isAnaphylaxis)) {
        severity = 'CRITICAL';
      } else if (isAnaphylaxis || pct >= 5) {
        severity = 'HIGH';
      }

      alerts.push({
        type: 'ALLERGY',
        severity,
        title: `⚠️ Allergy Cross-Reactivity Detected (${pct}%)`,
        message: `Documented ${allergy.allergen} allergy warns cross-sensitivity risk with ${newDrug.genericName}. Guidance: ${crossRule.clinical_guidance}`,
        overrideStrategy: severity === 'CRITICAL' ? 'NON-OVERRIDABLE CLINICAL BOUNDARY' : 'Requires high-level clinical override permission and dynamic telemetry observation.'
      });
    }
  }

  return alerts;
}

/**
 * Checks if a drug requires adjustments based on calculated eGFR thresholds
 */
export function checkRenalDosing(
  newDrug: { genericName: string; renalDosing?: DrugDosingRule | null },
  eGFR: number
): SafetyAlert[] {
  const alerts: SafetyAlert[] = [];
  const rule = newDrug.renalDosing;

  if (rule && rule.threshold > 0 && eGFR < rule.threshold) {
    let severity: 'CRITICAL' | 'HIGH' | 'MODERATE' = 'MODERATE';
    if (rule.action === 'contraindicated' || rule.action === 'avoid') {
      severity = 'CRITICAL';
    } else if (rule.action === 'adjust' || rule.action === 'reduce') {
      severity = 'HIGH';
    }

    alerts.push({
      type: 'RENAL',
      severity,
      title: `⚠️ Renal Dosing Threshold Crossed (eGFR: ${eGFR})`,
      message: `Dosing conflict for ${newDrug.genericName}: ${rule.message}`,
      overrideStrategy: rule.action === 'contraindicated' ? 'NON-OVERRIDABLE' : 'Dose recalculation and manual reduction required before submission.'
    });
  }

  return alerts;
}

/**
 * Advanced Protection Feature: Checks for concurrent usage of NSAIDs + ACEi/ARBs + Diuretics
 */
export function checkTripleWhammy(
  newDrug: { genericName: string; drugClass: string },
  currentMeds: Array<{ generic_name: string; drug_class: string }>
): SafetyAlert[] {
  const alerts: SafetyAlert[] = [];
  
  const allMeds = [...currentMeds, { generic_name: newDrug.genericName, drug_class: newDrug.drugClass }];
  const classes = allMeds.map(m => m.drug_class?.toLowerCase().trim());

  const hasNSAID = classes.includes('nsaid') || classes.includes('antiplatelet');
  const hasACEiOrARB = classes.includes('ace_inhibitor') || classes.includes('arb');
  const hasDiuretic = classes.includes('loop_diuretic') || classes.includes('k_sparing_diuretic');

  if (hasNSAID && hasACEiOrARB && hasDiuretic) {
    alerts.push({
      type: 'INTERACTION',
      severity: 'CRITICAL',
      title: '⛔ HARD BLOCK: "Triple Whammy" Nephrotoxicity Combo',
      message: `Concurrent prescribing of an NSAID/Antiplatelet, an ACEi/ARB, and a Diuretic triggers acute renal insufficiency via tri-focal renal perfusion changes. Order blocked.`,
      overrideStrategy: 'NON-OVERRIDABLE CLINICAL BOUNDARY'
    });
  }

  return alerts;
}

// --- 3. CONSTRAINT TEXT PROMPT GENERATOR ---

/**
 * Compiles all analytical database checks into defensive instruction text for system prompt injection.
 */
export function generateSystemConstraintText(
  patientName: string,
  calculatedMetrics: { eGFR: number; chadsVasc?: number },
  alerts: SafetyAlert[]
): string {
  let text = `### MANDATORY CLINICAL SAFETY CONSTRAINTS FOR PATIENT: ${patientName.toUpperCase()} ###\n`;
  text += `[SYSTEM LAYER: DETERMINISTIC VALIDATION ACTIVE. YOU MUST COMPLY WITH ALL BLOCKS BELOW]\n\n`;
  
  text += `CRITICAL METRICS:\n`;
  text += `- Calculated eGFR (CKD-EPI 2021): ${calculatedMetrics.eGFR} mL/min/1.73m²\n`;
  if (calculatedMetrics.chadsVasc !== undefined) {
    text += `- Calculated CHA₂DS₂-VASc Score: ${calculatedMetrics.chadsVasc}\n`;
  }
  text += `\n`;

  if (alerts.length === 0) {
    text += `✅ No severe direct active clinical alert blocks triggered for this specific instruction sequence.\n`;
    return text;
  }

  text += `ACTIVE ALERTS AND BLOCKS:\n`;
  alerts.forEach((alert, index) => {
    const symbol = alert.severity === 'CRITICAL' ? '⛔' : '⚠️';
    text += `${index + 1}. [${alert.type} - Severity: ${alert.severity}] ${symbol} ${alert.title}\n`;
    text += `   - Context: ${alert.message}\n`;
    if (alert.overrideStrategy) {
      text += `   - Enforcement Strategy: ${alert.overrideStrategy}\n`;
    }
    text += `\n`;
  });

  text += `[INSTRUCTION]: Under no circumstances will you declare the blocked medications as acceptable choices. If a hard block is active, you must gracefully refuse the order and offer standard alternative combinations listed under safe clinical options.\n`;
  
  return text;
}
// src/lib/safety-engine.ts
import { PatientLabs, PatientConditions, DrugDosingRule, SafetyAlert, CrossReactivityRule } from './types';

// --- 1. CLINICAL MATHEMATICAL CALCULATORS ---

/**
 * Computes estimated Glomerular Filtration Rate (eGFR) using the CKD-EPI (2021) equation.
 * Formula: eGFR = 142 × min(Scr/κ, 1)^α × max(Scr/κ, 1)^(-1.200) × 0.9938^Age × Multiplier
 */
export function calculateEGFR(labs: PatientLabs): number {
  const { creatinine, age, gender } = labs;
  const kappa = gender === 'female' ? 0.7 : 0.9;
  const alpha = gender === 'female' ? -0.241 : -0.302;
  const multiplier = gender === 'female' ? 1.012 : 1.0;

  const scrTermMin = Math.min(creatinine / kappa, 1);
  const scrTermMax = Math.max(creatinine / kappa, 1);

  const egfr = 142 * Math.pow(scrTermMin, alpha) * Math.pow(scrTermMax, -1.200) * Math.pow(0.9938, age) * multiplier;

  return Math.round(egfr * 10) / 10; // Precision rounding to 1 decimal point
}

/**
 * Computes the CHA₂DS₂-VASc Stroke Risk Score for Atrial Fibrillation.
 * Scoring Matrix: C(1) H(1) A2(2) D(1) S2(2) V(1) A(1) Sc(1)
 */
export function calculateChadsVasc(
  age: number, 
  gender: 'male' | 'female', 
  conditions: PatientConditions
): { score: number; text: string; anticoagulationRecommended: boolean } {
  let score = 0;

  if (conditions.hasCHF) score += 1;
  if (conditions.hasHTN) score += 1;
  if (conditions.hasDM) score += 1;
  if (conditions.hasStrokeOrTIA) score += 2;
  if (conditions.hasVascularDisease) score += 1;

  // Age Thresholds
  if (age >= 75) score += 2;
  else if (age >= 65) score += 1;

  // Biological Sex Category
  if (gender === 'female') score += 1;

  // Clinical Recommendations thresholds
  const thresholdM = 2;
  const thresholdF = 3;
  const isRecommended = (gender === 'male' && score >= thresholdM) || (gender === 'female' && score >= thresholdF);

  let guidanceText = `CHA₂DS₂-VASc Score: ${score}. `;
  if (isRecommended) {
    guidanceText += "Anticoagulation therapy is STRONGLY indicated due to high statistical ischemic stroke liability.";
  } else {
    guidanceText += "Anticoagulation presents low-to-moderate clinical utility baseline.";
  }

  return {
    score,
    text: guidanceText,
    anticoagulationRecommended: isRecommended
  };
}

// --- 2. DETERMINISTIC CORE SAFETY CHECKS ---

/**
 * Checks for direct and cross-reactive allergies across configured matrices
 */
export function checkAllergyConflicts(
  newDrug: { genericName: string; drugClass: string },
  patientAllergies: Array<{ allergen: string; manifestation: string; reactionType: string }>,
  crossReactivityRules: CrossReactivityRule[]
): SafetyAlert[] {
  const alerts: SafetyAlert[] = [];

  for (const allergy of patientAllergies) {
    const standardizedAllergen = allergy.allergen.toLowerCase().trim();
    const standardizedNewDrug = newDrug.genericName.toLowerCase().trim();

    // Direct Match Check
    if (standardizedNewDrug.includes(standardizedAllergen) || standardizedAllergen.includes(standardizedNewDrug)) {
      alerts.push({
        type: 'ALLERGY',
        severity: 'CRITICAL',
        title: `⛔ HARD BLOCK: Direct Allergy Match`,
        message: `Patient has documented allergy to ${allergy.allergen} (${allergy.manifestation}). Prescribing ${newDrug.genericName} is strictly blocked.`,
        overrideStrategy: 'NON-OVERRIDABLE CLINICAL BOUNDARY'
      });
      continue;
    }

    // Cross-Reactivity Match Check (Bi-directional fallback lookup)
    const crossRule = crossReactivityRules.find(
      rule => 
        (rule.drug_class_a === allergy.reactionType && rule.drug_class_b === newDrug.drugClass) ||
        (rule.drug_class_a === newDrug.drugClass && rule.drug_class_b === allergy.reactionType)
    );

    if (crossRule) {
      const pct = Number(crossRule.cross_reactivity_pct);
      const isAnaphylaxis = allergy.manifestation.toLowerCase().includes('anaphylaxis');
      
      let severity: 'CRITICAL' | 'HIGH' | 'MODERATE' = 'MODERATE';
      if (pct >= 50 || (allergy.reactionType === 'penicillin' && newDrug.drugClass === 'cephalosporin_1st' && isAnaphylaxis)) {
        severity = 'CRITICAL';
      } else if (isAnaphylaxis || pct >= 5) {
        severity = 'HIGH';
      }

      alerts.push({
        type: 'ALLERGY',
        severity,
        title: `⚠️ Allergy Cross-Reactivity Detected (${pct}%)`,
        message: `Documented ${allergy.allergen} allergy warns cross-sensitivity risk with ${newDrug.genericName}. Guidance: ${crossRule.clinical_guidance}`,
        overrideStrategy: severity === 'CRITICAL' ? 'NON-OVERRIDABLE CLINICAL BOUNDARY' : 'Requires high-level clinical override permission and dynamic telemetry observation.'
      });
    }
  }

  return alerts;
}

/**
 * Checks if a drug requires adjustments based on calculated eGFR thresholds
 */
export function checkRenalDosing(
  newDrug: { genericName: string; renalDosing?: DrugDosingRule | null },
  eGFR: number
): SafetyAlert[] {
  const alerts: SafetyAlert[] = [];
  const rule = newDrug.renalDosing;

  if (rule && rule.threshold > 0 && eGFR < rule.threshold) {
    let severity: 'CRITICAL' | 'HIGH' | 'MODERATE' = 'MODERATE';
    if (rule.action === 'contraindicated' || rule.action === 'avoid') {
      severity = 'CRITICAL';
    } else if (rule.action === 'adjust' || rule.action === 'reduce') {
      severity = 'HIGH';
    }

    alerts.push({
      type: 'RENAL',
      severity,
      title: `⚠️ Renal Dosing Threshold Crossed (eGFR: ${eGFR})`,
      message: `Dosing conflict for ${newDrug.genericName}: ${rule.message}`,
      overrideStrategy: rule.action === 'contraindicated' ? 'NON-OVERRIDABLE' : 'Dose recalculation and manual reduction required before submission.'
    });
  }

  return alerts;
}

/**
 * Advanced Protection Feature: Checks for concurrent usage of NSAIDs + ACEi/ARBs + Diuretics
 */
export function checkTripleWhammy(
  newDrug: { genericName: string; drugClass: string },
  currentMeds: Array<{ generic_name: string; drug_class: string }>
): SafetyAlert[] {
  const alerts: SafetyAlert[] = [];
  
  const allMeds = [...currentMeds, { generic_name: newDrug.genericName, drug_class: newDrug.drugClass }];
  const classes = allMeds.map(m => m.drug_class?.toLowerCase().trim());

  const hasNSAID = classes.includes('nsaid') || classes.includes('antiplatelet');
  const hasACEiOrARB = classes.includes('ace_inhibitor') || classes.includes('arb');
  const hasDiuretic = classes.includes('loop_diuretic') || classes.includes('k_sparing_diuretic');

  if (hasNSAID && hasACEiOrARB && hasDiuretic) {
    alerts.push({
      type: 'INTERACTION',
      severity: 'CRITICAL',
      title: '⛔ HARD BLOCK: "Triple Whammy" Nephrotoxicity Combo',
      message: `Concurrent prescribing of an NSAID/Antiplatelet, an ACEi/ARB, and a Diuretic triggers acute renal insufficiency via tri-focal renal perfusion changes. Order blocked.`,
      overrideStrategy: 'NON-OVERRIDABLE CLINICAL BOUNDARY'
    });
  }

  return alerts;
}

// --- 3. CONSTRAINT TEXT PROMPT GENERATOR ---

/**
 * Compiles all analytical database checks into defensive instruction text for system prompt injection.
 */
export function generateSystemConstraintText(
  patientName: string,
  calculatedMetrics: { eGFR: number; chadsVasc?: number },
  alerts: SafetyAlert[]
): string {
  let text = `### MANDATORY CLINICAL SAFETY CONSTRAINTS FOR PATIENT: ${patientName.toUpperCase()} ###\n`;
  text += `[SYSTEM LAYER: DETERMINISTIC VALIDATION ACTIVE. YOU MUST COMPLY WITH ALL BLOCKS BELOW]\n\n`;
  
  text += `CRITICAL METRICS:\n`;
  text += `- Calculated eGFR (CKD-EPI 2021): ${calculatedMetrics.eGFR} mL/min/1.73m²\n`;
  if (calculatedMetrics.chadsVasc !== undefined) {
    text += `- Calculated CHA₂DS₂-VASc Score: ${calculatedMetrics.chadsVasc}\n`;
  }
  text += `\n`;

  if (alerts.length === 0) {
    text += `✅ No severe direct active clinical alert blocks triggered for this specific instruction sequence.\n`;
    return text;
  }

  text += `ACTIVE ALERTS AND BLOCKS:\n`;
  alerts.forEach((alert, index) => {
    const symbol = alert.severity === 'CRITICAL' ? '⛔' : '⚠️';
    text += `${index + 1}. [${alert.type} - Severity: ${alert.severity}] ${symbol} ${alert.title}\n`;
    text += `   - Context: ${alert.message}\n`;
    if (alert.overrideStrategy) {
      text += `   - Enforcement Strategy: ${alert.overrideStrategy}\n`;
    }
    text += `\n`;
  });

  text += `[INSTRUCTION]: Under no circumstances will you declare the blocked medications as acceptable choices. If a hard block is active, you must gracefully refuse the order and offer standard alternative combinations listed under safe clinical options.\n`;
  
  return text;

}