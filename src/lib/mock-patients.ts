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
