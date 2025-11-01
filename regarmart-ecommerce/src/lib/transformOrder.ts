import { OrderProduct } from "@/types/order";
import { Alamat } from "@/types/alamat";

export const transformOrder = (order: any, alamatAktif?: any, cartItems?: OrderProduct[]) => {
  console.log("Raw order data for transform:", order);

  const orderNumber = order.orderNumber || `${(order.id || order.orderId || '').slice(0, 8)}`;

  let products: OrderProduct[] = [];

if (order.orderItems && order.orderItems.length > 0) {
  console.log("Using products from order.orderItems");
  products = order.orderItems.map((item: any) => ({
    id: item.productId || item.id,
    name: item.product?.name || "Produk",
    qty: item.quantity || 0, // ← GUNAKAN 'qty' BUKAN 'quantity'
    price: `Rp${Number(item.unitPrice || 0).toLocaleString("id-ID")}`,
    image: item.product?.imageUrl?.[0] || "/placeholder-product.png",
  }));
}

  // HANDLE TOTAL
  const totalAmount = Number(order.totalAmount) || 0;
  const shippingCost = Number(order.shippingCost) || 20000;
  
  let calculatedTotal = totalAmount;
  
  if (totalAmount === 0 && products.length > 0) {
    calculatedTotal = products.reduce((sum, product) => {
      const price = typeof product.price === 'string' 
        ? Number(product.price.replace(/[^\d]/g, "")) 
        : Number(product.price) || 0;
      return sum + (price * product.qty);
    }, 0) + shippingCost;
  }

  // HANDLE ADDRESS
  let resolvedAddress = null;
  if (alamatAktif) {
    resolvedAddress = alamatAktif;
  } else if (order.selectedAddress) {
    resolvedAddress = order.selectedAddress;
  } else if (order.address) {
    resolvedAddress = order.address;
  } else if (order.shippingAddress) {
    resolvedAddress = order.shippingAddress;
  }

  // Format alamat 
  const formattedAddress = {
    id: resolvedAddress?.id || "",
    nama: resolvedAddress?.recipientName || resolvedAddress?.nama || "Nama tidak tersedia",
    telp: resolvedAddress?.phoneNumber || resolvedAddress?.telp || "Telepon tidak tersedia",
    alamat: resolvedAddress?.fullAddress || resolvedAddress?.alamat || "Alamat tidak tersedia",
    utama: resolvedAddress?.isPrimary || resolvedAddress?.utama || false,
  } as Alamat;

  // Format contact info
  const contactName = resolvedAddress?.recipientName || resolvedAddress?.nama || "";
  const contactPhone = resolvedAddress?.phoneNumber || resolvedAddress?.telp || "";
  const contact = `${contactName} | ${contactPhone}`.trim();

  return {
    orderNumber: orderNumber,
    status: order.status || "PROCESSING",
    total: order.total || `Rp${calculatedTotal.toLocaleString("id-ID")}`,
    paymentMethod: order.paymentMethod || "COD",
    address: formattedAddress,
    contact: contact,
    products: products,
    dateCompleted: order.completedAt || order.updatedAt,
    shippingCost: `Rp${shippingCost.toLocaleString("id-ID")}`,
    originalData: order
  };
};