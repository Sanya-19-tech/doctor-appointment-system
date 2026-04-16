using System.ComponentModel.DataAnnotations;

namespace HealthcareSystem.Models
{
    public class Patient
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public int Age { get; set; }

        [Required]
        public string Contact { get; set; } = string.Empty;

        public string? MedicalHistory { get; set; }
    }
}