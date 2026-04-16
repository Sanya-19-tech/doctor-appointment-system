//MedicineController

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
    public class MedicineController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MedicineController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 🔹 GET ALL MEDICINES
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetMedicines()
        {
            return Ok(await _context.Medicines.ToListAsync());
        }

        // 🔹 ADD MEDICINE
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddMedicine(CreateMedicineDto dto)
        {
            var medicine = MedicineMapper.ToEntity(dto);

            _context.Medicines.Add(medicine);
            await _context.SaveChangesAsync();

            return Ok(medicine);
        }
    }
}
