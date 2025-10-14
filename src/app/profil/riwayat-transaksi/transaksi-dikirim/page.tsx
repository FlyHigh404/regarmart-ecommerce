"use client";
import { useEffect, useState } from "react";
import TabRiwayat from "@/components/TabRiwayat";
import CardOrder from "@/components/CardOrder";
import { OrderStatus } from "@/types/order";
import { transformOrder } from "@/lib/transformOrder";

export default function TransaksiDikirimPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/profile/riwayat-transaksi", { cache: "no-store" });
        if (!res.ok) throw new Error("Gagal fetch data");
        const data = await res.json();

        const filtered = data
          .filter((o: any) => o.status === OrderStatus.SHIPPED)
          .map(transformOrder);

        setOrders(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="w-full md:w-[756.65px] rounded-[15px] bg-white p-4 md:p-8 font-jakarta"
         style={{ boxShadow: "6px 6px 54px 0 rgba(0, 0, 0, 0.05)" }}>
      <TabRiwayat />
      {isLoading ? (
        <div className="p-4 text-center text-gray-500">
          <svg className="animate-spin h-5 w-5 mr-3 inline text-green-500" viewBox="0 0 24 24"></svg>
          Memuat data pesanan...
        </div>
      ) : orders.length === 0 ? (
        <div className="p-4 text-center">
          <img src="/bgcart.png" alt="Kosong" className="mx-auto w-32 h-32 mb-2" />
          <h2 className="text-md font-semibold text-gray-800 mb-1">Tidak ada transaksi</h2>
          <p className="text-sm text-gray-500">Belum ada pesanan dikirim</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <CardOrder key={order.orderNumber} index={index} {...order} />
          ))}
        </div>
      )}
    </div>
  );
}