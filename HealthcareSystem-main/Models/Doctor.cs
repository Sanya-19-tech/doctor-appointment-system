using System.ComponentModel.DataAnnotations;

namespace HealthcareSystem.Models
{
    public class Doctor
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Specialization { get; set; } = string.Empty;
    }
}