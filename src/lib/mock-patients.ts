import { Patient } from './types';

export const ASSESSMENT_PATIENTS: Patient[] = [
  {
    id: 1,
    name: 'John Smith',
    age: 65,
    gender: 'male',
    medications: ['Metoprolol', 'Lisinopril', 'Atorvastatin'],
    allergies: [],
    creatinine: 1.5,
    weight: 75,
    height: 175,
    systolicBP: 135,
    diastolicBP: 85,
    labs: { creatinine: 1.5, age: 65, gender: 'male' },
    conditions: { hasHTN: true }
  },
  {
    id: 2,
    name: 'Jane Doe',
    age: 72,
    gender: 'female',
    medications: ['Levothyroxine', 'Amlodipine'],
    allergies: [{ allergen: 'Penicillin', manifestation: 'Rash', reactionType: 'penicillin' }],
    creatinine: 2.1,
    weight: 65,
    height: 165,
    systolicBP: 142,
    diastolicBP: 88,
    labs: { creatinine: 2.1, age: 72, gender: 'female' },
    conditions: { hasHTN: true }
  },
  {
    id: 3,
    name: 'Robert Johnson',
    age: 58,
    gender: 'male',
    medications: ['Aspirin', 'Enalapril', 'Furosemide'],
    allergies: [{ allergen: 'NSAIDs', manifestation: 'GI upset', reactionType: 'nsaid' }],
    creatinine: 1.8,
    weight: 85,
    height: 180,
    systolicBP: 138,
    diastolicBP: 86,
    labs: { creatinine: 1.8, age: 58, gender: 'male' },
    conditions: { hasCHF: true, hasHTN: true }
  },
  {
    id: 4,
    name: 'Mary Wilson',
    age: 35,
    gender: 'female',
    medications: ['Metformin'],
    allergies: [],
    creatinine: 3.2,
    weight: 70,
    height: 168,
    systolicBP: 125,
    diastolicBP: 80,
    labs: { creatinine: 3.2, age: 35, gender: 'female', hba1c: 8.5 },
    conditions: { hasDM: true }
  },
];