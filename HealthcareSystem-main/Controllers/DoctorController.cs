//DoctorController

using Microsoft.AspNetCore.Mvc;
using HealthcareSystem.Data;
using HealthcareSystem.Models;
using HealthcareSystem.DTOs;
using HealthcareSystem.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace HealthcareSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DoctorController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DoctorController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 🔹 GET ALL DOCTORS
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetDoctors()
        {
            var doctors = await _context.Doctors.ToListAsync();
            return Ok(doctors);
        }

        // 🔹 ADD DOCTOR
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> AddDoctor(CreateDoctorDto dto)
        {
            var doctor = DoctorMapper.ToEntity(dto);

            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();

            return Ok(doctor);
        }

        // 🔹 UPDATE DOCTOR
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDoctor(int id, CreateDoctorDto dto)
        {
            var doctor = await _context.Doctors.FindAsync(id);

            if (doctor == null)
                return NotFound();

            DoctorMapper.UpdateEntity(doctor, dto);

            await _context.SaveChangesAsync();

            return Ok(doctor);
        }

        // 🔹 DELETE DOCTOR
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);

            if (doctor == null)
                return NotFound();

            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();

            return Ok("Doctor deleted");
        }
    }
}