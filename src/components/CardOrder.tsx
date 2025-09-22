"use client";
import { Truck } from "lucide-react";
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

  const renderStatus = () => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return (
          <div className="px-3 py-1 rounded-full text-[12px] font-semibold bg-green-100 text-green-600">
            Pesanan selesai
          </div>
        );
      case OrderStatus.SHIPPED:
        return (
          <div className="px-3 py-1 rounded-full text-[12px] font-semibold bg-orange-100 text-orange-600">
            Kurir Menjemput
          </div>
        );
      case OrderStatus.PROCESSING:
        return (
          <div className="px-3 py-1 rounded-full text-[12px] font-semibold bg-orange-100 text-orange-600">
            Pesanan diproses
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div
        className={`border border-gray-300 p-4 rounded-2xl relative transition-all duration-300 group animate-card-appear font-jakarta
                   ${status === OrderStatus.COMPLETED ? "hover:border-green-500 hover:shadow-sm" : "hover:border-green-500 hover:shadow-sm"}`}
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
                      className="rounded-lg border border-green-600 text-green-600 px-3 py-1 text-[8px] sm:text-[12px] font-semibold
                                 hover:bg-green-50 transition-all"
                    >
                      Beri rating
                    </button>
                    <button
                      onClick={() => setOpenConfirm(true)}
                      className="rounded-lg bg-green-600 text-white px-3 py-1 text-[8px] sm:text-[12px] font-semibold
                                 hover:bg-green-700 transition-all"
                    >
                      Beli lagi
                    </button>
                  </div>
                </div>
              )}
              
              {/* Harga produk untuk status proses */}
              {[OrderStatus.PROCESSING, OrderStatus.SHIPPED].includes(status) && (
                <div className="text-[14px] font-medium text-black">
                  {product.price}
                </div>
              )}
            </div>
          ))}
        </div>

        <hr className="my-3 border-gray-200" />

        {/* Info Pengiriman + Total */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col text-[13px]">
            <div className="flex items-center gap-2">
              <Truck className={`w-5 h-5 ${status === OrderStatus.COMPLETED ? "text-green-600" : "text-green-600"}`} />
              <span className={`${status === OrderStatus.COMPLETED ? "text-green-600" : "text-green-600"}`}>
                {status === OrderStatus.COMPLETED
                  ? "Pesanan telah tiba dan diterima customer"
                  : "Pesanan sedang dalam pengiriman"}
              </span>
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

        {/* Tombol di bawah card */}
        <div className="mt-3 text-right">
          {[OrderStatus.PROCESSING, OrderStatus.SHIPPED].includes(status) && (
            <button
              onClick={() => setOpenConfirm(true)}
              className="rounded-lg bg-green-600 px-4 py-1.5 text-[14px] font-semibold text-white hover:bg-green-700 transition-all duration-300 hover:shadow-lg transform hover:scale-105 active:scale-95"
            >
              Lihat detail
            </button>
          )}
        </div>
      </div>

      {/* Modal OrderConfirm */}
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

      {/* Modal FormRating */}
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