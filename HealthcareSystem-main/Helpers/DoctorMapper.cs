using HealthcareSystem.DTOs;
using HealthcareSystem.Models;
using System.Numerics;

namespace HealthcareSystem.Helpers
{
    public static class DoctorMapper
    {
        public static Doctor ToEntity(CreateDoctorDto dto)
        {
            return new Doctor
            {
                Name = dto.Name,
                Specialization = dto.Specialization
            };
        }

        public static void UpdateEntity(Doctor doctor, CreateDoctorDto dto)
        {
            doctor.Name = dto.Name;
            doctor.Specialization = dto.Specialization;
        }
    }
}