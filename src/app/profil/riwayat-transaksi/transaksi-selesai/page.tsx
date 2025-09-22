"use client";
import CardOrder from "@/components/CardOrder";
import { PaymentMethod, OrderProduct, OrderStatus } from "@/types/order";
import { Alamat } from "@/types/alamat";
import Link from "next/link";
import React from "react";

const ordersDone = [
  {
    orderNumber: "#INV-0010",
    status: OrderStatus.COMPLETED,
    total: "Rp250.000",
    products: [
      {
        id: "2",
        name: "Minyak Goreng Tropical 2L x 2",
        price: "Rp125.000",
        qty: 2,
        image: "/wortel.png",
      },
      {
        id: "3",
        name: "Gula Pasir Gulaku 1Kg",
        price: "Rp75.000",
        qty: 1,
        image: "/telur.png",
      },
      {
        id: "4",
        name: "Telur Ayam Negeri 10 Butir",
        price: "Rp50.000",
        qty: 1,
        image: "/telur.png", 
      },
    ] as OrderProduct[],
    paymentMethod: PaymentMethod.COD,
    address: {
      id: 2,
      nama: "Team Zenith",
      telp: "08123456789",
      alamat: "Jl. Sudirman No. 22, Bandung 40123",
    } as Alamat,
    contact: "08123456789",
    dateCompleted: "16 September 2025",
  },
  {
    orderNumber: "#INV-0009",
    status: OrderStatus.COMPLETED,
    total: "Rp75.000",
    products: [
      {
        id: "3",
        name: "Gula Pasir Gulaku 1Kg",
        price: "Rp75.000",
        qty: 1,
        image: "/telur.png",
      },
    ] as OrderProduct[],
    paymentMethod: PaymentMethod.QRIS,
    address: {
      id: 3,
      nama: "Team Genesis",
      telp: "08123456789",
      alamat: "Jl. Melati No. 10, Jakarta 12345",
    } as Alamat,
    contact: "08123456789",
    dateCompleted: "15 September 2025",
  },
];

export default function TransaksiSelesaiPage() {
  return (
    <div
      className="w-full md:w-[756.65px] rounded-[15px] bg-white p-4 md:p-8 font-jakarta"
      style={{ boxShadow: "6px 6px 54px 0 rgba(0, 0, 0, 0.05)" }}
    >
      {/* Tabs */}
      <div className="flex w-full text-center p-2 md:p-3 mb-4 md:mb-6">
        <Link
          href="/profil/riwayat-transaksi/transaksi-diproses"
          className="flex-1 py-2 text-xs md:text-sm font-semibold text-gray-400 border-b-1 hover:text-gray-600"
        >
          Sedang proses
        </Link>
        <Link
          href="/profil/riwayat-transaksi/transaksi-selesai"
          className="flex-1 py-2 text-xs md:text-sm font-semibold text-green-600 border-b-2 border-green-600"
        >
          Selesai
        </Link>
      </div>

      {/* List Order */}
      <div className="space-y-4">
        {ordersDone.map((order, index) => (
          <CardOrder
            key={order.orderNumber}
            index={index}
            orderNumber={order.orderNumber}
            status={order.status}
            total={order.total}
            products={order.products}
            paymentMethod={order.paymentMethod}
            address={order.address}
            contact={order.contact}
            dateCompleted={order.dateCompleted}
          />
        ))}
      </div>
    </div>
  );
}