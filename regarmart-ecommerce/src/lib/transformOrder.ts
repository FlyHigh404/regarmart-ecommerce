// src/lib/transformOrder.ts
import { OrderProduct } from "@/types/order";
import { Alamat } from "@/types/alamat";

export const transformOrder = (order: any) => {
  console.log("Raw order data:", order); // 🔍 DEBUG: Lihat struktur data sebenarnya

  // Transform products
  const products: OrderProduct[] = (order.orderItems || []).map((item: any) => ({
    id: item.productId || item.id,
    name: item.product?.name || "Produk tidak tersedia",
    qty: Number(item.quantity) || 0,
    price: `Rp${Number(item.unitPrice || 0).toLocaleString("id-ID")}`,
    image: item.product?.imageUrl?.[0] || "/placeholder-product.png",
  }));

  // 🔥 FIX: Gunakan totalAmount dari backend yang SUDAH include ongkir
  const totalAmount = Number(order.totalAmount) || 0;
  
  // Jika totalAmount 0, hitung manual (fallback)
  const calculatedTotal = totalAmount > 0 
    ? totalAmount 
    : products.reduce((sum, product) => {
        const price = Number((product.price as string).replace(/[^\d]/g, "")) || 0;
        return sum + (price * product.qty);
      }, 0) + 20000; // + ongkir default

  return {
    orderNumber: order.id, // Gunakan order.id sebagai orderNumber
    status: order.status,
    total: `Rp${calculatedTotal.toLocaleString("id-ID")}`,
    paymentMethod: order.paymentMethod,
    address: {
      id: order.shippingAddress?.id || order.address?.id || "",
      nama: order.shippingAddress?.recipientName || order.address?.recipientName || "Tidak tersedia",
      telp: order.shippingAddress?.phoneNumber || order.address?.phoneNumber || "Tidak tersedia",
      alamat: order.shippingAddress?.fullAddress || order.address?.fullAddress || "Alamat tidak tersedia",
      utama: order.shippingAddress?.isPrimary || order.address?.isPrimary || false,
    } as Alamat,
    contact: `${order.shippingAddress?.recipientName || order.address?.recipientName || ""} | ${
      order.shippingAddress?.phoneNumber || order.address?.phoneNumber || ""
    }`.trim(),
    products,
    dateCompleted: order.completedAt || order.updatedAt,
  };
};