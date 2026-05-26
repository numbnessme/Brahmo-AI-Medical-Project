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
