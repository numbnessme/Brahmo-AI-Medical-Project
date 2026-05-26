export interface Patient {
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

export interface Alert {
  title: string;
  message: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  overrideStrategy?: string;
}

export interface PatientLabs {
  creatinine: number;
  age: number;
  gender: string;
}

export interface PatientConditions {
  hasCHF?: boolean;
  hasHTN?: boolean;
  hasDM?: boolean;
  hasStrokeOrTIA?: boolean;
  hasVascularDisease?: boolean;
}

export interface DrugDosingRule {
  threshold: number;
  action: string;
  message: string;
}

export interface SafetyAlert {
  type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  title: string;
  message: string;
  overrideStrategy?: string;
}

export interface CrossReactivityRule {
  drug_class_a: string;
  drug_class_b: string;
  cross_reactivity_pct: number | string;
  clinical_guidance: string;
}
