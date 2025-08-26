import CardOrder, { OrderProduct } from "@/components/CardOrder";
import Link from "next/link";

const ordersDone = [
  {
    orderNumber: "#INV-0010",
    status: "Selesai",
    total: "Rp250.000",
    product: {
      id: "2",
      name: "Minyak Goreng Tropical 2L x 2",
      price: "Rp125.000",
      qty: 2,
      image: "/wortel.png",
    } as OrderProduct,
  },
  {
    orderNumber: "#INV-0009",
    status: "Selesai",
    total: "Rp75.000",
    product: {
      id: "3",
      name: "Gula Pasir Gulaku 1Kg",
      price: "Rp75.000",
      qty: 1,
      image: "/telur.png",
    } as OrderProduct,
  },
];

export default function TransaksiSelesaiPage() {
  return (
    <div
      className="w-[756.65px] rounded-[15px] bg-white p-8 font-jakarta"
      style={{ boxShadow: "6px 6px 54px 0 rgba(0, 0, 0, 0.05)" }}
    >
      {/* Tabs */}
      <div className="flex w-full text-center p-3 border-b border-gray-200 mb-6">
        <Link
          href="/profil/riwayat-transaksi/transaksi-diproses"
          className="px-6 py-2 text-sm font-semibold text-gray-400 hover:text-gray-600"
        >
          Sedang proses
        </Link>
        <Link
          href="/profil/riwayat-transaksi/transaksi-diproses"
          className="px-6 py-2 text-sm font-semibold text-green-600 border-b-2 border-green-600"
        >
          Selesai
        </Link>
      </div>

      {/* List Order */}
      <div className="space-y-4">
        {ordersDone.map((order, index) => (
          <CardOrder
            key={order.product.id}
            index={index}
            orderNumber={order.orderNumber}
            status={order.status}
            total={order.total}
            product={order.product}
          />
        ))}
      </div>
    </div>
  );
}
