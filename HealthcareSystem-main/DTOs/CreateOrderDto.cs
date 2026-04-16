namespace HealthcareSystem.DTOs
{
    public class CreateOrderDto
    {
        public List<OrderItemDto> Items { get; set; } = new();
    }

    public class OrderItemDto
    {
        public int MedicineId { get; set; }
        public int Quantity { get; set; }
    }
}