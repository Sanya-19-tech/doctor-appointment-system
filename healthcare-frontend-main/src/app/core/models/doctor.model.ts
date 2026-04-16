export interface Doctor {
  id: number;
  name: string;
  specialization: string;
}

export interface CreateDoctorRequest {
  name: string;
  specialization: string;
}