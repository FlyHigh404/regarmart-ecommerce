"use client";
import { Truck, XCircle } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Alamat } from "@/types/alamat";
import OrderConfirm from "@/components/OrderConfirm";
import FormRating from "@/components/FormRating";
import { OrderStatus, PaymentMethod, OrderProduct } from "@/types/order";

interface CardOrderProps {
  index: number;
  orderNumber: string;
  status: OrderStatus;
  total: string;
  products: OrderProduct[];
  paymentMethod: PaymentMethod;
  address: Alamat;
  contact: string;
  dateCompleted?: string;
}

const CardOrder: React.FC<CardOrderProps> = ({
  index,
  orderNumber,
  status,
  total,
  products,
  paymentMethod,
  address,
  contact,
  dateCompleted,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const [openConfirm, setOpenConfirm] = useState(false);
  const [openCancelPopup, setOpenCancelPopup] = useState(false);
  const [openRating, setOpenRating] = useState<null | OrderProduct>(null);
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);

  // ✅ Update status pesanan
  const updateOrderStatus = async (newStatus: "CANCELED" | "COMPLETED") => {
    try {
      setLoading(true);
      const res = await fetch("/api/profile/riwayat-transaksi", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Gagal update status");

      const updated =
        newStatus === "CANCELED" ? OrderStatus.CANCELED : OrderStatus.COMPLETED;
      setCurrentStatus(updated);

      // Redirect ke tab sesuai status
      if (updated === OrderStatus.CANCELED) {
        router.push("/profil/riwayat-transaksi/transaksi-dibatalkan");
      } else if (updated === OrderStatus.COMPLETED) {
        router.push("/profil/riwayat-transaksi/transaksi-selesai");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengubah status pesanan");
    } finally {
      setLoading(false);
      setOpenCancelPopup(false);
      setOpenConfirm(false);
    }
  };

  const handleCancelOrder = () => updateOrderStatus("CANCELED");
  const handleCompleteOrder = () => updateOrderStatus("COMPLETED");

  // ✅ Warna badge per status
  const renderStatus = () => {
    switch (currentStatus) {
      case OrderStatus.PROCESSING:
        return (
          <div className="px-3 py-1 rounded-[10px] text-[12px] font-semibold bg-[#FFFBD1] text-[#CA8A04]">
            Sedang diproses
          </div>
        );
      case OrderStatus.SHIPPED:
        return (
          <div className="px-3 py-1 rounded-[10px] text-[12px] font-semibold bg-[#FFE9D6] text-[#EA580C]">
            Dikirim
          </div>
        );
      case OrderStatus.COMPLETED:
        return (
          <div className="px-3 py-1 rounded-[10px] text-[12px] font-semibold bg-[#DEF7EC] text-[#047857]">
            Pesanan selesai
          </div>
        );
      case OrderStatus.CANCELED:
        return (
          <div className="px-3 py-1 rounded-[10px] text-[12px] font-semibold bg-[#FFE6E6] text-[#DC2626]">
            Dibatalkan
          </div>
        );
      default:
        return null;
    }
  };

  // ✅ Tombol bawah kanan sesuai status
  const renderButtons = () => {
    switch (currentStatus) {
      case OrderStatus.PROCESSING:
        return (
          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => setOpenCancelPopup(true)}
              className="rounded-[13px] bg-red-100 text-red-500 px-4 py-1.5 text-[12px] font-semibold hover:bg-red-200 transition-all"
            >
              Batalkan pesanan
            </button>
            <button
              onClick={() => setOpenConfirm(true)}
              className="rounded-[13px] bg-green-600 text-white px-4 py-1.5 text-[12px] font-semibold hover:bg-green-700 transition-all"
            >
              Lihat detail
            </button>
          </div>
        );
      case OrderStatus.SHIPPED:
        return (
          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={handleCompleteOrder}
              disabled={loading}
              className="rounded-[13px] bg-green-100 text-green-600 px-4 py-1.5 text-[12px] font-semibold hover:bg-green-200 transition-all disabled:opacity-70"
            >
              {loading ? "Memproses..." : "Selesaikan pesanan"}
            </button>
            <button
              onClick={() => setOpenConfirm(true)}
              className="rounded-[13px] bg-green-600 text-white px-4 py-1.5 text-[12px] font-semibold hover:bg-green-700 transition-all"
            >
              Lihat detail
            </button>
          </div>
        );
      case OrderStatus.CANCELED:
        return (
          <div className="mt-3 text-right">
            <button
              onClick={() =>
                window.open(`/katalog/${products[0]?.id}`)
              }
              className="rounded-[13px] bg-green-600 text-white px-4 py-1.5 text-[12px] font-semibold hover:bg-green-700 transition-all"
            >
              Beli lagi
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    switch (currentStatus) {
      case OrderStatus.PROCESSING:
        return "Pesanan anda sedang kami siapkan";
      case OrderStatus.SHIPPED:
        return "Pesanan sedang diantar oleh kurir";
      case OrderStatus.COMPLETED:
        return "Pesanan telah tiba dan diterima customer";
      case OrderStatus.CANCELED:
        return "Pesanan dibatalkan oleh Anda";
      default:
        return "";
    }
  };

  return (
    <>
      {/* --- Kartu Utama --- */}
      <div
        className={`border border-gray-300 p-4 rounded-2xl relative transition-all duration-300 group font-jakarta
          ${currentStatus === OrderStatus.CANCELED ? "opacity-95" : ""}
          hover:border-green-500 hover:shadow-sm`}
        style={{ animationDelay: `${700 + index * 200}ms` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-[14px] font-bold text-[#1B1F1B]">
            No Pesanan : <span>#INV {orderNumber}</span>
          </div>
          {renderStatus()}
        </div>

        {/* Produk */}
        <div className="space-y-3">
          {products.map((product: OrderProduct) => (
            <div key={product.id} className="flex items-center gap-3">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={58}
                height={58}
                className="h-[58px] w-[58px] flex-shrink-0 rounded-md object-cover"
              />
              <div className="flex-1">
                <div className="text-[13px] font-medium text-black">
                  {product.name}
                </div>
                <div className="mt-1 text-[12px] text-gray-500">
                  Qty: x{product.qty}
                </div>
              </div>

              {currentStatus === OrderStatus.COMPLETED ? (
                <div className="flex flex-row gap-2 items-center">
                  <button
                    onClick={() => setOpenRating(product)}
                    className="rounded-lg border border-green-600 text-green-600 px-3 py-1 text-[12px] font-semibold hover:bg-green-50 transition-all"
                  >
                    Beri rating
                  </button>
                  <button
                    onClick={() =>router.push(`/katalog/${product.id}`)
                    }
                    className="rounded-lg bg-green-600 text-white px-3 py-1 text-[12px] font-semibold hover:bg-green-700 transition-all"
                  >
                    Beli lagi
                  </button>
                </div>
              ) : (
                <div className="text-[14px] font-medium text-black">
                  {product.price}
                </div>
              )}
            </div>
          ))}
        </div>

        <hr className="my-3 border-gray-200" />

        {/* Info Pengiriman */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col text-[13px]">
            <div className="flex items-center gap-2">
              {currentStatus !== OrderStatus.CANCELED && (
                <Truck className="w-5 h-5 text-green-600" />
              )}
              <span className="text-green-600">{getStatusMessage()}</span>
            </div>
            {dateCompleted && (
              <span className="text-gray-500 text-[12px] mt-1">
                {dateCompleted}
              </span>
            )}
          </div>
          <div className="text-[14px] font-bold text-black">
            Total pesanan : {total}
          </div>
        </div>

        {renderButtons()}
      </div>

      {/* Modal Konfirmasi Pembatalan */}
      {openCancelPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-[100%] max-w-sm rounded-xl p-5 shadow-xl text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-gray-800 mb-1">
              Batalkan pesanan?
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Apakah Anda yakin ingin membatalkan pesanan ini?
            </p>

            <div className="border border-gray-200 rounded-lg p-3 text-left mb-4">
              <p className="text-sm font-semibold">
                No Pesanan: <span className="text-green-700">#{orderNumber}</span>
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Image
                  src={products[0]?.image || "/placeholder.svg"}
                  alt={products[0]?.name || "Produk"}
                  width={40}
                  height={40}
                  className="rounded-md object-cover"
                />
                <div>
                  <p className="text-xs text-gray-800">
                    {products[0]?.name || "Nama produk"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Qty: x{products[0]?.qty}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setOpenCancelPopup(false)}
                className="flex-1 border border-gray-300 text-gray-700 font-semibold rounded-lg h-10 hover:bg-gray-100 transition"
              >
                Tidak
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg h-10 transition disabled:opacity-70"
              >
                {loading ? "Memproses..." : "Iya"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail */}
      {openConfirm && (
        <OrderConfirm
          open={openConfirm}
          onClose={() => setOpenConfirm(false)}
          status={currentStatus}
          orderNumber={orderNumber}
          products={products}
          total={total}
          paymentMethod={paymentMethod}
          address={{
            ...address,
            utama: address.utama ?? false,
          }}
          contact={contact}
        />
      )}

      {/* Form Rating */}
      {openRating && (
        <FormRating
          open={!!openRating}
          onClose={() => setOpenRating(null)}
          orderNumber={orderNumber}
          product={openRating}
        />
      )}
    </>
  );
};

export default CardOrder;