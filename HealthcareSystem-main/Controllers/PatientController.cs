//PatientController

using Microsoft.AspNetCore.Mvc;
using HealthcareSystem.Data;
using HealthcareSystem.Models;
using HealthcareSystem.DTOs; // ✅ ADD THIS
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

using HealthcareSystem.Helpers;

namespace HealthcareSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // 🔐 Protect all APIs
    public class PatientController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PatientController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 🔹 GET ALL PATIENTS
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetPatients()
        {
            var patients = await _context.Patients.ToListAsync();
            return Ok(patients);
        }

        // 🔹 ADD PATIENT (UPDATED WITH DTO)
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> AddPatient(CreatePatientDto dto)
        {
            var patient = PatientMapper.ToEntity(dto);
            //{
            //   Name = dto.Name,
            //   Age = dto.Age,
            //   Contact = dto.Contact,
            //    MedicalHistory = dto.MedicalHistory
            // };

            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            return Ok(patient);
        }

        // 🔹 UPDATE PATIENT (OPTIONAL: can also use DTO later)
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePatient(int id, CreatePatientDto dto)
        {
            var patient = await _context.Patients.FindAsync(id);

            if (patient == null)
                return NotFound();

            PatientMapper.UpdateEntity(patient, dto);

            //patient.Name = dto.Name;
            //patient.Age = dto.Age;
            //patient.Contact = dto.Contact;
            //patient.MedicalHistory = dto.MedicalHistory;

            await _context.SaveChangesAsync();

            return Ok(patient);
        }

        // 🔹 DELETE PATIENT
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);

            if (patient == null)
                return NotFound();

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();

            return Ok("Patient deleted");
        }
    }
}