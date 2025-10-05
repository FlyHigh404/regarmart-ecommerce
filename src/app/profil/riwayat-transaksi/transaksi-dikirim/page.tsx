"use client";
import CardOrder from "@/components/CardOrder";
import { PaymentMethod, OrderProduct, OrderStatus } from "@/types/order";
import { Alamat } from "@/types/alamat";
import TabRiwayat from "@/components/TabRiwayat";

const ordersShipped = [
  {
    orderNumber: "#INV-0012",
    status: OrderStatus.SHIPPED,
    total: "Rp95.000",
    products: [
      {
        id: "2",
        name: "Minyak Goreng Tropical 2L",
        price: "Rp47.500",
        qty: 2,
        image: "/ktgbuah.png",
      },
    ] as OrderProduct[],
    paymentMethod: PaymentMethod.QRIS,
    address: {
      id: 2,
      nama: "Team Zenith",
      telp: "08123456789",
      alamat: "Jl. Sudirman No. 22, Bandung",
    } as Alamat,
    contact: "08123456789",
  },
];

export default function TransaksiDikirimPage() {
  return (
    <div className="w-full md:w-[756.65px] rounded-[15px] bg-white p-4 md:p-8 font-jakarta"
         style={{ boxShadow: "6px 6px 54px 0 rgba(0, 0, 0, 0.05)" }}>
      <TabRiwayat />

      {ordersShipped.length === 0 ? (
        <div className="p-4 text-center">
          <img src="/bgcart.png" alt="Kosong"
               className="mx-auto w-32 h-32 object-contain mb-2" />
          <h2 className="text-md font-semibold text-gray-800 mb-1">Tidak ada transaksi</h2>
          <p className="text-sm text-gray-500">Belum ada pesanan dikirim</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ordersShipped.map((order, index) => (
            <CardOrder key={order.orderNumber} index={index} {...order} />
          ))}
        </div>
      )}
    </div>
  );
}