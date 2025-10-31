import { OrderProduct } from "@/types/order";
import { Alamat } from "@/types/alamat";

export const transformOrder = (order: any, alamatAktif?: any, cartItems?: OrderProduct[]) => {
  console.log("Raw order data for transform:", order);

  // HANDLE ORDER NUMBER UNTUK CHECKOUT RESPONSE
  const orderNumber = order.orderNumber || `${(order.id || order.orderId || '').slice(0, 8)}`;

  // HANDLE PRODUCTS - prioritaskan data dari parameter cartItems
  let products: OrderProduct[] = [];
  
  // Priority 1: Data dari parameter cartItems (paling reliable)
  if (cartItems && cartItems.length > 0) {
    console.log("Using cart items from parameter:", cartItems);
    products = cartItems;
  }
  // Priority 2: Data dari backend (jika ada)
  else if (order.products && order.products.length > 0) {
    console.log("Using products from order.products");
    products = order.products;
  }
  else if (order.orderItems && order.orderItems.length > 0) {
    console.log("Using products from order.orderItems");
    products = order.orderItems.map((item: any) => ({
      id: item.productId || item.id,
      name: item.product?.name || "Produk tidak tersedia",
      qty: Number(item.quantity) || 0,
      price: `Rp${Number(item.unitPrice || 0).toLocaleString("id-ID")}`,
      image: item.product?.imageUrl?.[0] || "/placeholder-product.png",
    }));
  }
  else if (order.items && order.items.length > 0) {
    console.log("Using products from order.items");
    products = order.items.map((item: any) => ({
      id: item.productId || item.id,
      name: item.product?.name || item.name || "Produk tidak tersedia",
      qty: Number(item.quantity || item.qty) || 0,
      price: item.price || `Rp${Number(item.unitPrice || 0).toLocaleString("id-ID")}`,
      image: item.product?.imageUrl?.[0] || item.image || "/placeholder-product.png",
    }));
  }
  // Priority 3: Kosong (fallback)
  else {
    console.warn("No product data available in order response");
    products = [];
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

  // Format alamat untuk display
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