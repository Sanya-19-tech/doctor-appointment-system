public class CreatePatientDto
{
    public string Name { get; set; } = string.Empty;
    public int Age { get; set; }
    public string Contact { get; set; } = string.Empty;
    public string? MedicalHistory { get; set; }
}