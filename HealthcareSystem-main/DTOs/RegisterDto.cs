using System.ComponentModel.DataAnnotations;

namespace HealthcareSystem.DTOs
{
    public class RegisterDto
    {
        [Required]
        public required string Name { get; set; }

        [Required]
        public required string Email { get; set; }

        [Required]
        public required string Password { get; set; }
    }
}