using HealthcareSystem.Models;
using HealthcareSystem.DTOs;

namespace HealthcareSystem.Helpers
{
    public static class AppointmentMapper
    {
        public static Appointment ToEntity(CreateAppointmentDto dto)
        {
            return new Appointment
            {
                PatientId = dto.PatientId,
                DoctorId = dto.DoctorId,
                AppointmentDate = dto.AppointmentDate
            };
        }
    }
}