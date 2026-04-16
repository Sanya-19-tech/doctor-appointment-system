export interface Medicine {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

export interface CreateMedicineRequest {
  name: string;
  category: string;
  price: number;
  stock: number;
}