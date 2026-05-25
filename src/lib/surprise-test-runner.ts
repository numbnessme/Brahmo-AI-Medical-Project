import { calculateEGFR, checkAllergyConflicts, checkRenalDosing, SafetyAlert, CrossReactivityRule } from './safety-engine';
import { Patient, DatabaseDDI, DatabaseDrug } from './types';

/**
 * UTILITY HARNESS TO PRE-TEST SURPRISE SCENARIOS LIVE
 * Evaluates complex multi-drug configurations instantly
 */
export async function simulateSurpriseScenario(
  mockPatient: Patient,
  proposedNewDrug: DatabaseDrug,
  crossReactivityRules: CrossReactivityRule[],
  ddiTableMock: DatabaseDDI[]
): Promise<{ safeToPrescribe: boolean; triggeredAlerts: SafetyAlert[] }> {
  
  const alerts: SafetyAlert[] = [];

  // 1. Calculate underlying baseline math
  const egfr = calculateEGFR({
    creatinine: mockPatient.labs.creatinine,
    age: mockPatient.age,
    gender: mockPatient.gender
  });

  // 2. Evaluate unexpected renal boundaries
  const renalChecks = checkRenalDosing(
    { genericName: proposedNewDrug.generic_name, renalDosing: proposedNewDrug.renal_dosing },
    egfr
  );
  alerts.push(...renalChecks);

  // 3. Evaluate unexpected allergy shifts
  const allergyChecks = checkAllergyConflicts(
    { genericName: proposedNewDrug.generic_name, drugClass: proposedNewDrug.drug_class },
    mockPatient.allergies,
    crossReactivityRules
  );
  alerts.push(...allergyChecks);

  // 4. Verify cross-linked combinatorial DDI combinations
  mockPatient.medications.forEach(med => {
    const normalizedRegimenMed = med.split(' ')[0].toLowerCase().trim();
    const targetNormalized = proposedNewDrug.generic_name.toLowerCase().trim();

    const match = ddiTableMock.find(rule => 
      (rule.drug_a.generic_name.toLowerCase() === targetNormalized && rule.drug_b.generic_name.toLowerCase() === normalizedRegimenMed) ||
      (rule.drug_b.generic_name.toLowerCase() === targetNormalized && rule.drug_a.generic_name.toLowerCase() === normalizedRegimenMed)
    );

    if (match) {
      alerts.push({
        type: 'INTERACTION',
        severity: match.severity === 'SEVERE' || match.severity === 'CONTRAINDICATED' ? 'CRITICAL' : 'MODERATE',
        title: `⛔ Live Intercept Matrix Match: ${proposedNewDrug.generic_name} + ${med}`,
        message: match.mechanism,
        overrideStrategy: 'BLOCK'
      });
    }
  });

  return {
    safeToPrescribe: !alerts.some(a => a.severity === 'CRITICAL'),
    triggeredAlerts: alerts
  };
}