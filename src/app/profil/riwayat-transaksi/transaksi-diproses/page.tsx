// app/profil/riwayat-transaksi/transaksi-diproses/page.tsx

import CardOrder from "@/components/CardOrder";
import { PaymentMethod, type OrderProduct, OrderStatus } from "@/types/order";
import { Alamat } from "@/types/alamat";
import Link from "next/link";
import React from "react";

const ordersProcess = [
  {
    orderNumber: "#INV-0015",
    status: OrderStatus.PROCESSING,
    total: "Rp170.500",
    products: [
      {
        id: "1",
        name: "Beras Raja Platinum | Beras Slyp Super Quality | 10 Kilogram",
        price: "Rp168.500",
        qty: 1,
        image: "/susu.png",
      },
    ] as OrderProduct[],
    paymentMethod: PaymentMethod.COD,
    address: {
      id: 1,
      nama: "Team Genesis",
      telp: "0895360577489",
      alamat: "Jl. Merpati No.40ab, Kepuh, Betro, Kec. Sedati, Kabupaten Sidoarjo, Jawa Timur 61253, Indonesia",
    } as Alamat,
    contact: "08123456789",
  },
];

export default function TransaksiDiprosesPage() {
  return (
    <div
      className="w-full md:w-[756.65px] rounded-[15px] bg-white p-4 md:p-8 font-jakarta"
      style={{ boxShadow: "6px 6px 54px 0 rgba(0, 0, 0, 0.05)" }}
    >
      {/* Tabs */}
      <div className="flex w-full text-center p-2 md:p-3 mb-4 md:mb-6">
        <Link
          href="/profil/riwayat-transaksi/transaksi-diproses"
          className="flex-1 py-2 text-xs md:text-sm font-semibold text-green-600 border-b-2 border-green-600"
        >
          Sedang proses
        </Link>
        <Link
          href="/profil/riwayat-transaksi/transaksi-selesai"
          className="flex-1 py-2 text-xs md:text-sm font-semibold text-gray-400 border-b-1 hover:text-gray-600"
        >
          Selesai
        </Link>
      </div>

      {/* List Order */}
      <div className="space-y-4">
        {ordersProcess.map((order, index) => (
          <CardOrder
            key={order.orderNumber}
            index={index}
            orderNumber={order.orderNumber}
            status={order.status}
            total={order.total}
            products={order.products}
            paymentMethod={order.paymentMethod as any}
            address={order.address}
            contact={order.contact}
          />
        ))}
      </div>
    </div>
  );
}