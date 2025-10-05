"use client";
import CardOrder from "@/components/CardOrder";
import { PaymentMethod, OrderProduct, OrderStatus } from "@/types/order";
import { Alamat } from "@/types/alamat";
import TabRiwayat from "@/components/TabRiwayat";
import { useState, useEffect } from "react";

const ordersProcess = [
  {
    orderNumber: "#INV-0015",
    status: OrderStatus.PROCESSING,
    total: "Rp170.500",
    products: [
      {
        id: "1",
        name: "Beras Raja Platinum 10Kg",
        price: "Rp168.500",
        qty: 1,
        image: "/ktgbuah.png",
      },
    ] as OrderProduct[],
    paymentMethod: PaymentMethod.COD,
    address: {
      id: 1,
      nama: "Team Genesis",
      telp: "0895360577489",
      alamat: "Jl. Merpati No.40ab, Sidoarjo",
    } as Alamat,
    contact: "08123456789",
  },
];

export default function TransaksiDiprosesPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const [ordersRes, addressRes] = await Promise.all([
          fetch('/api/profile/riwayat-transaksi', { cache: 'no-store' }),
          fetch('/api/profile/address-primary', { cache: 'no-store' })
        ]);
        const ordersData = await ordersRes.json();
        const addressData = await addressRes.json();
        setOrders(ordersData);
        setUserAddress(addressData ? `${addressData.street}, ${addressData.city}, ${addressData.province}, ${addressData.zipCode}` : null);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }
    fetchOrders();
  }, []);
  
  return (
    <div className="w-full md:w-[756.65px] rounded-[15px] bg-white p-4 md:p-8 font-jakarta"
         style={{ boxShadow: "6px 6px 54px 0 rgba(0, 0, 0, 0.05)" }}>
      <TabRiwayat />

      {ordersProcess.length === 0 ? (
        <div className="p-4 text-center">
          <img src="/bgcart.png" alt="Kosong"
               className="mx-auto w-32 h-32 object-contain mb-2" />
          <h2 className="text-md font-semibold text-gray-800 mb-1">Tidak ada transaksi</h2>
          <p className="text-sm text-gray-500">Belum ada pesanan diproses</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ordersProcess.map((order, index) => (
            <CardOrder key={order.orderNumber} index={index} {...order} />
          ))}
        </div>
      )}
    </div>
  );
}