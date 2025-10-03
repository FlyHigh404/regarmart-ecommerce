"use client"
import CardOrder from "@/components/CardOrder"
import Link from "next/link"
import { useState, useEffect } from "react"

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
        {orders.map((order) => (
          <CardOrder
            key={order.id}
            orderNumber={order.id}
            status={order.status}
            total={order.totalAmount}
            product={order.orderItems[0]}
            paymentMethod={order.paymentMethod as any}
            address={ userAddress || "Alamat belum diatur"}
            contact={order.user.phone || "No. HP belum diatur"}
          />
        ))}
      </div>
    </div>
  )
}
