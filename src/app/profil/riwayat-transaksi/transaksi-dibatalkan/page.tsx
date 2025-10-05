"use client";
import CardOrder from "@/components/CardOrder";
import { PaymentMethod, OrderProduct, OrderStatus } from "@/types/order";
import { Alamat } from "@/types/alamat";
import TabRiwayat from "@/components/TabRiwayat";

const ordersCancelled = [
  {
    orderNumber: "#INV-0008",
    status: OrderStatus.CANCELED,
    total: "Rp150.000",
    products: [
      { id: "5", name: "Susu UHT 1L", price: "Rp25.000", qty: 6, image: "/susu.png" },
    ] as OrderProduct[],
    paymentMethod: PaymentMethod.COD,
    address: {
      id: 4,
      nama: "Team Beta",
      telp: "08123456789",
      alamat: "Jl. Kenanga No. 5, Surabaya",
    } as Alamat,
    contact: "08123456789",
  },
];

export default function TransaksiDibatalkanPage() {
  return (
    <div className="w-full md:w-[756.65px] rounded-[15px] bg-white p-4 md:p-8 font-jakarta"
         style={{ boxShadow: "6px 6px 54px 0 rgba(0, 0, 0, 0.05)" }}>
      <TabRiwayat />

      {ordersCancelled.length === 0 ? (
        <div className="p-4 text-center">
          <img src="/bgcart.png" alt="Kosong"
               className="mx-auto w-32 h-32 object-contain mb-2" />
          <h2 className="text-md font-semibold text-gray-800 mb-1">Tidak ada transaksi</h2>
          <p className="text-sm text-gray-500">Belum ada pesanan dibatalkan</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ordersCancelled.map((order, index) => (
            <CardOrder key={order.orderNumber} index={index} {...order} />
          ))}
        </div>
      )}
    </div>
  );
}