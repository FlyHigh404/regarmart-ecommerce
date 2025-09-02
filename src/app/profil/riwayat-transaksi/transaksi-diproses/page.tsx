import CardOrder from "@/components/CardOrder";
import { PaymentMethod, OrderProduct, OrderStatus } from "@/types/order";
import Link from "next/link";

const ordersProcess = [
  {
    orderNumber: "#INV-0015",
    status: OrderStatus.SHIPPED,
    total: "Rp170.500",
    product: {
      id: "1",
      name: "Beras Raja Platinum | Beras Slyp Super Quality | 10 Kilogram",
      price: "Rp168.500",
      qty: 1,
      image: "/susu.png",
    } as OrderProduct,
    paymentMethod: PaymentMethod.COD,
    address: {
      id: 1,
      nama: "Rania",
      telp: "08123456789",
      alamat: "Jl. Merdeka No. 45, Jakarta 12345", 
    },
    contact: "08123456789",
  },
];



export default function TransaksiDiprosesPage() {
  return (
    <div className="w-[756.65px] rounded-[15px] bg-white p-8 font-jakarta"
      style={{ boxShadow: "6px 6px 54px 0 rgba(0, 0, 0, 0.05)" }}
    >
      {/* Tabs */}
      <div className="flex w-full text-center p-3 border-b border-gray-200 mb-6">
        <Link
          href="/profil/riwayat-transaksi/transaksi-diproses"
          className="px-6 py-2 text-sm font-semibold text-green-600 border-b-2 border-green-600"
        >
          Sedang proses
        </Link>
        <Link
          href="/profil/riwayat-transaksi/transaksi-selesai"
          className="px-6 py-2 text-sm font-semibold text-gray-400 text-center p-3 hover:text-gray-600"
        >
          Selesai
        </Link>
      </div>

      {/* List Order */}
      <div className="space-y-4">
        {ordersProcess.map((order, index) => (
          <CardOrder
          key={order.product.id}
          index={index}
          orderNumber={order.orderNumber}
          status={order.status}
          total={order.total}
          product={order.product}
          paymentMethod={order.paymentMethod as any} 
          address={order.address}
          contact={order.contact}
          />
        ))}
      </div>
    </div>
  );
}
