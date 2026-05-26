export interface PatientLabs {
  creatinine: number;
  age: number;
  gender: string;
  hba1c?: number;
}

export interface PatientConditions {
  hasCHF?: boolean;
  hasHTN?: boolean;
  hasDM?: boolean;
  hasStrokeOrTIA?: boolean;
  hasVascularDisease?: boolean;
}

export interface Patient {
  id: string | number;
  name: string;
  age: number;
  gender: 'male' | 'female' | string;
  medications: string[];
  allergies: Array<{ allergen: string; manifestation: string; reactionType?: string }>;
  creatinine?: number;
  weight?: number;
  height?: number;
  systolicBP?: number;
  diastolicBP?: number;
  labs: PatientLabs;
  conditions: PatientConditions;
}

export interface Alert {
  title: string;
  message: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  overrideStrategy?: string;
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

export interface DatabaseDrug {
  id: number;
  generic_name: string;
  generic_name_normalized: string;
  drug_class: string;
  renal_dosing: DrugDosingRule | null;
}

export interface DatabaseDDI {
  drug_a: DatabaseDrug;
  drug_b: DatabaseDrug;
  severity: string;
  mechanism: string;
}
