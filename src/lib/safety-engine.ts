import { Patient, Alert } from './types';

export interface SafetyCheckResult {
  systemConstraintText: string;
  alerts: Alert[];
}

export const runDeterministicCheck = (drug: string, patient: Patient): SafetyCheckResult => {
  const alerts: Alert[] = [];
  const constraints = `Checking ${drug} for ${patient.name}`;

  return {
    systemConstraintText: constraints,
    alerts,
  };
};
