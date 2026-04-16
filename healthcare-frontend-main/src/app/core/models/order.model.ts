export interface OrderItem {
  medicineId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  items: OrderItem[];
}

export interface OrderResponse {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
}

// Cart item used locally in frontend (not sent to API)
export interface CartItem {
  medicine: {
    id: number;
    name: string;
    price: number;
    stock: number;
  };
  quantity: number;
}