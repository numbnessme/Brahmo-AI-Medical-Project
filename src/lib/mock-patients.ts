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