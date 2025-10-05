"use client";
import CardOrder from "@/components/CardOrder";
import { PaymentMethod, OrderProduct, OrderStatus } from "@/types/order";
import { Alamat } from "@/types/alamat";
import TabRiwayat from "@/components/TabRiwayat";

const ordersDone = [
  {
    orderNumber: "#INV-0010",
    status: OrderStatus.COMPLETED,
    total: "Rp250.000",
    products: [
      { id: "3", name: "Gula Pasir Gulaku 1Kg", price: "Rp75.000", qty: 2, image: "/ktgbuah.png" },
      { id: "4", name: "Telur Ayam 10 Butir", price: "Rp50.000", qty: 2, image: "/ktgsayur.png" },
    ] as OrderProduct[],
    paymentMethod: PaymentMethod.COD,
    address: {
      id: 3,
      nama: "Team Omega",
      telp: "08123456789",
      alamat: "Jl. Melati No. 10, Jakarta",
    } as Alamat,
    contact: "08123456789",
    dateCompleted: "16 September 2025",
  },
];

export default function TransaksiSelesaiPage() {
  return (
    <div className="w-full md:w-[756.65px] rounded-[15px] bg-white p-4 md:p-8 font-jakarta"
         style={{ boxShadow: "6px 6px 54px 0 rgba(0, 0, 0, 0.05)" }}>
      <TabRiwayat />

      {ordersDone.length === 0 ? (
        <div className="p-4 text-center">
          <img src="/bgcart.png" alt="Kosong"
               className="mx-auto w-32 h-32 object-contain mb-2" />
          <h2 className="text-md font-semibold text-gray-800 mb-1">Tidak ada transaksi</h2>
          <p className="text-sm text-gray-500">Belum ada pesanan selesai</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ordersDone.map((order, index) => (
            <CardOrder key={order.orderNumber} index={index} {...order} />
          ))}
        </div>
      )}
    </div>
  );
}