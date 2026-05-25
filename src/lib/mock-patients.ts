<<<<<<< HEAD
import { Patient } from './types';

export const ASSESSMENT_PATIENTS: Patient[] = [
  {
    id: "p1",
    name: "Patient 1 (Scenario 2 Demo)",
    age: 65,
    gender: "male",
    medications: ["Metformin 1g BD", "Glimepiride 2mg OD", "Telmisartan 40mg OD", "Atorvastatin 20mg HS"],
    allergies: [{ allergen: "Penicillin", manifestation: "ANAPHYLAXIS 2023", reactionType: "penicillin" }],
    labs: { creatinine: 2.1, hba1c: 8.4, kPlus: 5.1 },
    conditions: { hasCHF: false, hasHTN: true, hasDM: true, hasStrokeOrTIA: false, hasVascularDisease: false }
  },
  {
    id: "p3",
    name: "Patient 3 (Scenario 1 Demo)",
    age: 78,
    gender: "male",
    medications: ["Amlodipine 10mg", "Telmisartan 80mg", "Metformin 500mg BD", "Glimepiride 1mg", "Atorvastatin 40mg", "Aspirin 75mg", "Diclofenac PRN (OTC)"],
    allergies: [{ allergen: "Sulfonamide", manifestation: "rash", reactionType: "sulfonamide" }],
    labs: { creatinine: 1.4 },
    conditions: { hasCHF: false, hasHTN: true, hasDM: true, hasStrokeOrTIA: false, hasVascularDisease: false }
  },
  {
    id: "p7",
    name: "Patient 7 (Scenario 3 Demo)",
    age: 35,
    gender: "female",
    medications: ["Meropenem 1g IV TDS", "Noradrenaline", "Insulin infusion", "Enoxaparin 40mg"],
    allergies: [{ allergen: "Penicillin", manifestation: "rash, NOT anaphylaxis", reactionType: "penicillin" }],
    labs: { creatinine: 3.2 },
    conditions: { hasCHF: false, hasHTN: false, hasDM: false, hasStrokeOrTIA: false, hasVascularDisease: false }
  },
  {
    id: "p8",
    name: "Patient 8 (Scenario 4 Demo)",
    age: 68,
    gender: "male",
    medications: ["Warfarin 5mg", "Bisoprolol 5mg", "Ramipril 5mg", "Atorvastatin 80mg", "Furosemide 40mg", "Spironolactone 25mg"],
    allergies: [],
    labs: { creatinine: 1.2, inr: 2.8 },
    conditions: { hasCHF: true, hasHTN: true, hasDM: true, hasStrokeOrTIA: true, hasVascularDisease: false }
  }
];
=======
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

export const ASSESSMENT_PATIENTS: Patient[] = [
  {
    id: 1,
    name: 'John Smith',
    age: 65,
    gender: 'Male',
    medications: ['Metoprolol', 'Lisinopril', 'Atorvastatin'],
    allergies: [],
    creatinine: 1.5,
    weight: 75,
    height: 175,
    systolicBP: 135,
    diastolicBP: 85,
  },
  {
    id: 2,
    name: 'Jane Doe',
    age: 72,
    gender: 'Female',
    medications: ['Levothyroxine', 'Amlodipine'],
    allergies: [{ allergen: 'Penicillin', manifestation: 'Rash' }],
    creatinine: 2.1,
    weight: 65,
    height: 165,
    systolicBP: 142,
    diastolicBP: 88,
  },
  {
    id: 3,
    name: 'Robert Johnson',
    age: 58,
    gender: 'Male',
    medications: ['Aspirin', 'Enalapril', 'Furosemide'],
    allergies: [{ allergen: 'NSAIDs', manifestation: 'GI upset' }],
    creatinine: 1.8,
    weight: 85,
    height: 180,
    systolicBP: 138,
    diastolicBP: 86,
  },
  {
    id: 4,
    name: 'Mary Wilson',
    age: 35,
    gender: 'Female',
    medications: ['Metformin'],
    allergies: [],
    creatinine: 3.2,
    weight: 70,
    height: 168,
    systolicBP: 125,
    diastolicBP: 80,
  },
];
>>>>>>> 944af93d08b53034c33eae1d1ba4435a6275b980
