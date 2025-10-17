// src/lib/transformOrder.ts
import { OrderProduct } from "@/types/order";
import { Alamat } from "@/types/alamat";

/**
 * Parse string price like "Rp 12.000" atau "12000" -> number 12000
 */
const parsePriceToNumber = (v: any): number => {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    // ambil angka saja, hapus semua selain digit
    const digits = v.replace(/[^\d]/g, "");
    return digits === "" ? 0 : Number(digits);
  }
  return 0;
};

export const transformOrder = (order: any) => {
  // ambil ongkir dari beberapa kemungkinan field
  const shippingCost =
    parsePriceToNumber(order.shippingCost ?? order.ongkir ?? order.shipping ?? order.deliveryFee ?? 0);

  // transform setiap item, pastikan qty & unitPrice benar
  const products: OrderProduct[] = (order.orderItems || []).map((item: any) => {
    const qty = Number(item.quantity ?? item.qty ?? item.qtyOrdered ?? 0);

    // unit price: cek beberapa kemungkinan lokasi
    const unitPriceCandidate =
      item.unitPrice ??
      item.price ??
      item.product?.unitPrice ??
      item.product?.price ??
      item.productPrice ??
      0;

    const unitPriceNumber = parsePriceToNumber(unitPriceCandidate);

    // format harga unit untuk UI: "Rp12.000"
    const priceFormatted = `Rp${unitPriceNumber.toLocaleString("id-ID")}`;

    // gambar: beberapa projek menyimpan array imageUrl, beberapa string
    const image =
      (Array.isArray(item.product?.imageUrl) && item.product.imageUrl[0]) ||
      item.product?.image ||
      item.product?.imageUrl ||
      "/placeholder-product.png";

    return {
      id: String(item.product?.id ?? item.id ?? Math.random().toString(36).slice(2, 9)),
      name: item.product?.name ?? item.name ?? "Produk",
      price: priceFormatted,
      qty,
      image,
      // optional: sisipkan unit price number agar bisa dipakai debug
      _unitPriceNumber: unitPriceNumber,
    } as unknown as OrderProduct;
  });

  // hitung total dari products (sum qty * unitPrice)
  let calculatedItemsTotal = 0;
  for (const p of products) {
    // akses unit price number dari property helper (jika ada)
    // beberapa struktur tidak punya _unitPriceNumber typed, jadi parse dari p.price
    const unitNum = parsePriceToNumber((p as any)._unitPriceNumber ?? p.price ?? 0);
    const qty = Number((p as any).qty ?? 0);
    calculatedItemsTotal += unitNum * qty;
  }

  // final total: items total + ongkir (jika ada)
  const calculatedTotal = calculatedItemsTotal + shippingCost;

  // fallback untuk total jika backend sudah menyimpan total (dalam bentuk number/string)
  const backendTotalNumber = parsePriceToNumber(order.total ?? order.totalAmount ?? order.grandTotal);

  // Gunakan calculatedTotal jika ada item; kalau tidak, fallback ke backendTotalNumber
  const finalTotalNumber = (calculatedItemsTotal > 0) ? calculatedTotal : backendTotalNumber;

  return {
    orderNumber: String(order.id ?? order.orderNumber ?? ""),
    status: order.status,
    // tampilkan total dalam format Rupiah
    total: `Rp${Number(finalTotalNumber || 0).toLocaleString("id-ID")}`,
    paymentMethod: order.paymentMethod,
    address: {
      id: order.addressId ?? 0,
      nama: order.recipientName ?? order.name ?? "-",
      telp: order.phoneNumber ?? order.phone ?? "-",
      alamat: order.fullAddress ?? order.address ?? "-",
      note: order.note ?? "",
    } as Alamat,
    contact: `${order.recipientName ?? order.name ?? ""} | ${order.phoneNumber ?? order.phone ?? ""}`,
    products,
    dateCompleted: order.dateCompleted ?? order.completedAt ?? order.deliveredAt ?? undefined,
    // debug (opsional): sertakan nilai numerik bila perlu (bisa dihilangkan)
    _debug: {
      calculatedItemsTotal,
      shippingCost,
      backendTotalNumber,
      finalTotalNumber,
    },
  };
};