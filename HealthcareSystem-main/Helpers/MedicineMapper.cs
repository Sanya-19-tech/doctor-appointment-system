using HealthcareSystem.Models;
using HealthcareSystem.DTOs;

namespace HealthcareSystem.Helpers
{
    public static class MedicineMapper
    {
        public static Medicine ToEntity(CreateMedicineDto dto)
        {
            return new Medicine
            {
                Name = dto.Name,
                Category = dto.Category,
                Price = dto.Price,
                Stock = dto.Stock
            };
        }
    }
}