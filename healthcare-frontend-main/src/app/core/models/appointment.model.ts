export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentDate: string;
  patient: { name: string };
  doctor:  { name: string };
}

export interface CreateAppointmentRequest {
  patientId: number;
  doctorId: number;
  appointmentDate: string;
}