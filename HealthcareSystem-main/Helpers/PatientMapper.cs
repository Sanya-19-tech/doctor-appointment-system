using HealthcareSystem.Models;
using HealthcareSystem.DTOs;

namespace HealthcareSystem.Helpers
{
    public static class PatientMapper
    {
        public static Patient ToEntity(CreatePatientDto dto)
        {
            return new Patient
            {
                Name = dto.Name,
                Age = dto.Age,
                Contact = dto.Contact,
                MedicalHistory = dto.MedicalHistory
            };
        }

        public static void UpdateEntity(Patient patient, CreatePatientDto dto)
        {
            patient.Name = dto.Name;
            patient.Age = dto.Age;
            patient.Contact = dto.Contact;
            patient.MedicalHistory = dto.MedicalHistory;
        }
    }
}