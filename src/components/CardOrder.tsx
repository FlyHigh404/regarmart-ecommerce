"use client";
import { Truck, XCircle } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
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
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openRating, setOpenRating] = useState<null | OrderProduct>(null);

  //Badge warna per status
  const renderStatus = () => {
    switch (status) {
      case OrderStatus.PROCESSING:
        return (
          <div className="px-3 py-1 rounded-[10px] text-[10px] lg:text-[12px] font-semibold bg-[#FFFBD1] text-[#CA8A04]">
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

  // Tombol bawah kanan sesuai status
  const renderButtons = () => {
    switch (status) {
      case OrderStatus.PROCESSING:
        return (
          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => setOpenConfirm(true)}
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
              onClick={() => setOpenConfirm(true)}
              className="rounded-[13px] bg-green-100 text-green-600 px-4 py-1.5 text-[12px] font-semibold hover:bg-green-200 transition-all"
            >
              Selesaikan pesanan
            </button>
            <button
              onClick={() => setOpenConfirm(true)}
              className="rounded-[13px] bg-green-600 text-white px-4 py-1.5 text-[12px] font-semibold hover:bg-green-700 transition-all"
            >
              Lihat detail
            </button>
          </div>
        );
      case OrderStatus.COMPLETED:
        return null; 
      case OrderStatus.CANCELED:
        return (
          <div className="mt-3 text-right">
            <button
              onClick={() =>
                window.open(`/produk/${products[0]?.id}`, "_blank")
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

  // Pesan status pengiriman
  const getStatusMessage = () => {
    switch (status) {
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
      <div
        className={`border border-gray-300 p-4 rounded-2xl relative transition-all duration-300 group font-jakarta
          ${status === OrderStatus.CANCELED ? "opacity-95" : ""}
          hover:border-green-500 hover:shadow-sm`}
        style={{ animationDelay: `${700 + index * 200}ms` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-[14px] font-bold text-[#1B1F1B]">
            No Pesanan : <span>{orderNumber}</span>
          </div>
          {renderStatus()}
        </div>

        {/* Produk List */}
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-3">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={58}
                height={58}
                className="h-[58px] w-[58px] flex-shrink-0 rounded-md object-cover"
              />
              <div className="flex-1">
                <div className="text-[11px] sm:text-[14px] font-medium text-black">
                  {product.name}
                </div>
                <div className="mt-1 text-[12px] text-gray-500">
                  Qty: x{product.qty}
                </div>
              </div>

              {/* Tombol hanya muncul jika status COMPLETED */}
              {status === OrderStatus.COMPLETED && (
                <div className="flex flex-col items-end gap-1">
                  <div className="text-[14px] font-medium text-black">
                    {product.price}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setOpenRating(product)}
                      className="rounded-lg border border-green-600 text-green-600 px-3 py-1 text-[10px] sm:text-[12px] font-semibold hover:bg-green-50 transition-all"
                    >
                      Beri rating
                    </button>
                    <button
                      onClick={() =>
                        window.open(`/produk/${product.id}`, "_blank")
                      }
                      className="rounded-lg bg-green-600 text-white px-3 py-1 text-[10px] sm:text-[12px] font-semibold hover:bg-green-700 transition-all"
                    >
                      Beli lagi
                    </button>
                  </div>
                </div>
              )}

              {/* Harga untuk selain COMPLETED */}
              {[OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.CANCELED].includes(status) && (
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
            {/* Icon dihapus khusus status dibatalkan */}
            {status !== OrderStatus.CANCELED && (
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


        {/* Tombol bawah */}
        {renderButtons()}
      </div>

      {/* Modal */}
      {openConfirm && (
        <OrderConfirm
          open={openConfirm}
          onClose={() => setOpenConfirm(false)}
          status={status}
          orderNumber={orderNumber}
          products={products}
          total={total}
          paymentMethod={paymentMethod}
          address={address}
          contact={contact}
        />
      )}

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