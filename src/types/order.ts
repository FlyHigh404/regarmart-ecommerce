export enum OrderStatus {
  PENDING = "Pesanan ditunda",
  PROCESSING = "Sedang proses",
  SHIPPED = "Dalam Pengiriman",
  COMPLETED = "Selesai",
  CANCELED = "Dibatalkan"
}

export enum PaymentMethod {
  COD = "COD",
  QRIS = "QRIS",
}

export interface OrderProduct {
  id: string;
  name: string;
  price: string;
  qty: number;
  image: string;
}
