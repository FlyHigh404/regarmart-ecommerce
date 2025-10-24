export interface Product {
  id: string | number;
  imageUrl: string;
  name: string;
  weight?: string;
  stock?: string | number;
  description?: string;
  price: string | number;
  rating?: number
}