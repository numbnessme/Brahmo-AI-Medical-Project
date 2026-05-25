<<<<<<< HEAD
// src/lib/types.ts

/**
 * BRAHMO Healthcare Architecture - Clinical Safety Engine Core Types
 */

export interface PatientLabs {
  creatinine: number;
  age: number;
  gender: 'male' | 'female';
  hba1c?: number;
  kPlus?: number;
  inr?: number;
}

export interface PatientConditions {
  hasCHF: boolean;
  hasHTN: boolean;
  hasDM: boolean;
  hasStrokeOrTIA: boolean;
  hasVascularDisease: boolean;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  medications: string[];
  allergies: Array<{
    allergen: string;
    manifestation: string;
    reactionType: string; // e.g., 'penicillin', 'sulfonamide', 'aceinhibitor'
  }>;
  labs: {
    creatinine: number;
    hba1c?: number;
    kPlus?: number;
    inr?: number;
  };
  conditions: PatientConditions;
}

export interface DrugDosingRule {
  threshold: number;
  action: 'contraindicated' | 'avoid' | 'adjust' | 'reduce' | 'none' | 'monitor';
  message: string;
}

export interface DatabaseDrug {
  id: string;
  generic_name: string;
  generic_name_normalized: string;
  drug_class: string;
  renal_dosing: DrugDosingRule | null;
}

export interface DatabaseDDI {
  severity: 'CONTRAINDICATED' | 'SEVERE' | 'MODERATE' | 'MINOR';
  mechanism: string;
  clinical_effect: string;
  management: string;
  drug_a: { generic_name: string };
  drug_b: { generic_name: string };
}

export interface CrossReactivityRule {
  drug_class_a: string;
  drug_class_b: string;
  cross_reactivity_pct: number | string;
  clinical_guidance: string;
}

export interface SafetyAlert {
  type: 'INTERACTION' | 'ALLERGY' | 'RENAL' | 'SCORE';
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'INFO';
  title: string;
  message: string;
  overrideStrategy?: string;
=======
// src/lib/types.ts

/**
 * BRAHMO Healthcare Architecture - Clinical Safety Engine Core Types
 */

export interface PatientLabs {
  creatinine: number;
  age: number;
  gender: 'male' | 'female';
  hba1c?: number;
  kPlus?: number;
  inr?: number;
}

export interface PatientConditions {
  hasCHF: boolean;
  hasHTN: boolean;
  hasDM: boolean;
  hasStrokeOrTIA: boolean;
  hasVascularDisease: boolean;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  medications: string[];
  allergies: Array<{
    allergen: string;
    manifestation: string;
    reactionType: string; // e.g., 'penicillin', 'sulfonamide', 'aceinhibitor'
  }>;
  labs: {
    creatinine: number;
    hba1c?: number;
    kPlus?: number;
    inr?: number;
  };
  conditions: PatientConditions;
}

export interface DrugDosingRule {
  threshold: number;
  action: 'contraindicated' | 'avoid' | 'adjust' | 'reduce' | 'none' | 'monitor';
  message: string;
}

export interface DatabaseDrug {
  id: string;
  generic_name: string;
  generic_name_normalized: string;
  drug_class: string;
  renal_dosing: DrugDosingRule | null;
}

export interface DatabaseDDI {
  severity: 'CONTRAINDICATED' | 'SEVERE' | 'MODERATE' | 'MINOR';
  mechanism: string;
  clinical_effect: string;
  management: string;
  drug_a: { generic_name: string };
  drug_b: { generic_name: string };
}

export interface CrossReactivityRule {
  drug_class_a: string;
  drug_class_b: string;
  cross_reactivity_pct: number | string;
  clinical_guidance: string;
}

export interface SafetyAlert {
  type: 'INTERACTION' | 'ALLERGY' | 'RENAL' | 'SCORE';
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'INFO';
  title: string;
  message: string;
  overrideStrategy?: string;
>>>>>>> 944af93d08b53034c33eae1d1ba4435a6275b980
}