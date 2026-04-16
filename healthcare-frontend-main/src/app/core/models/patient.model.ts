export interface Patient {
  id: number;
  name: string;
  age: number;
  contact: string;
  medicalHistory: string;
}

export interface CreatePatientRequest {
  name: string;
  age: number;
  contact: string;
  medicalHistory: string;
}