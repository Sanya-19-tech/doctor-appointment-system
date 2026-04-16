using System.ComponentModel.DataAnnotations;

namespace HealthcareSystem.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        public required string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        public required string Role { get; set; } // Admin / User
    }
}