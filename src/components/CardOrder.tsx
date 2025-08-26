import { Truck } from "lucide-react";
import Image from "next/image";
import React from "react";

export interface OrderProduct {
  id: string;
  name: string;
  price: string;
  qty: number;
  image: string;
}

interface CardOrderProps {
  index: number;
  orderNumber: string;
  status: string;
  total: string;
  product: OrderProduct;
}

const CardOrder: React.FC<CardOrderProps> = ({
  index,
  orderNumber,
  status,
  total,
  product,
}) => {
  return (
    <div
      key={product.id}
      className="border border-gray-300 p-4 rounded-2xl relative
                 hover:border-green-500 hover:shadow-sm
                 focus-within:border-green-500 focus-within:shadow-md focus-within:shadow-green-200
                 transition-all-duration-500 group animate-card-appear font-jakarta"
      style={{ animationDelay: `${900 + index * 200}ms` }}
    >
      {/* Nomor Pesanan + Status */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-[14px] font-bold text-[#1B1F1B]">
          No Pesanan : <span>{orderNumber}</span>
        </div>
        <div className="inline-flex items-center justify-center rounded-md bg-orange-100 px-2.5 py-0.5 text-[12px] font-medium text-orange-500">
          {status}
        </div>
      </div>

      {/* Produk */}
      <div className="flex items-center gap-3">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          width={58}
          height={58}
          className="h-[57.934px] w-[57.934px] flex-shrink-0 rounded-md object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="flex-1">
          <div className="text-[14px] font-medium text-black">
            {product.name}
          </div>
          <div className="mt-1 text-[12px] text-gray-500">Qty: x{product.qty}</div>
        </div>
        <div className="text-[14px] font-medium text-black">{product.price}</div>
      </div>

      <hr className="my-3 border-gray-200" />

      {/* Total + Info */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-[13px] text-green-600">
          <Truck className="w-6 h-6 text-green-600" />
          <span>Pesanan sedang diantar oleh kurir</span>
        </div>
        <div className="text-[14px] font-bold text-black">
          Total pesanan : {total}
        </div>
      </div>

      {/* Button */}
      <div className="mt-3 text-right">
        <button className="rounded-lg bg-green-600 px-4 py-1.5 text-[14px] font-semibold text-white hover:bg-green-700 transition-all duration-300 hover:shadow-lg transform hover:scale-105 active:scale-95">
          Lihat detail
        </button>
      </div>
    </div>
  );
};

export default CardOrder;
