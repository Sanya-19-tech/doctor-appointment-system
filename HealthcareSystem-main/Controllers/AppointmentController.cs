//AppointmentController

using Microsoft.AspNetCore.Mvc;
using HealthcareSystem.Data;
using HealthcareSystem.DTOs;
using HealthcareSystem.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace HealthcareSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AppointmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AppointmentController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 🔹 GET ALL APPOINTMENTS (with Doctor & Patient)
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAppointments()
        {
            var appointments = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .ToListAsync();

            return Ok(appointments);
        }

        // 🔹 CREATE APPOINTMENT
        [Authorize(Roles = "User,Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateAppointment(CreateAppointmentDto dto)
        {
            // Validate existence
            var patientExists = await _context.Patients.AnyAsync(p => p.Id == dto.PatientId);
            var doctorExists = await _context.Doctors.AnyAsync(d => d.Id == dto.DoctorId);

            if (!patientExists || !doctorExists)
                return BadRequest("Invalid Patient or Doctor ID");

            var appointment = AppointmentMapper.ToEntity(dto);

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return Ok(appointment);
        }
    }
}
