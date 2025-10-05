"use client";
import Image from "next/image";
import { useState } from "react";
import { MapPin, Check, Clock } from "lucide-react";
import { Alamat } from "@/types/alamat";
import { PaymentMethod, OrderStatus, OrderStatusLabel } from "@/types/order";

interface Product {
  id: string;
  name: string;
  price: string;
  qty: number;
  image: string;
}

export interface OrderConfirmProps {
  orderNumber: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  address: Alamat;
  contact: string;
  products: Product[];
  total: string;
  open: boolean;
  onClose: () => void;
}

const OrderConfirm: React.FC<OrderConfirmProps> = ({
  orderNumber,
  status,
  paymentMethod,
  address,
  products,
  total,
  open,
  onClose,
}) => {
  const [showAll, setShowAll] = useState(false);
  if (!open) return null;

  const getHeaderStyle = () => {
    switch (status) {
      case OrderStatus.SHIPPED:
        return "bg-[linear-gradient(180deg,#FFA04F_0%,#FF8A25_100%)] shadow-[6px_6px_54px_0_rgba(0,0,0,0.05)] rounded-t-[15px]";
      case OrderStatus.PROCESSING:
        return "bg-[linear-gradient(180deg,#F0E138_0%,#C3B300_100%)] shadow-[6px_6px_54px_0_rgba(0,0,0,0.05)] rounded-t-[15px]";
      case OrderStatus.COMPLETED:
        return "bg-[linear-gradient(145deg,#6EC568_13.92%,#26A81D_87.84%)] shadow-[6px_6px_54px_0_rgba(0,0,0,0.05)] rounded-t-[15px]";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 font-jakarta">
      <div className="bg-white rounded-xl shadow-lg w-[95%] sm:w-[650px] max-h-[85vh] overflow-y-auto relative">
        {/* HEADER */}
        <div
          className={`w-full flex justify-between items-center text-white px-4 sm:px-6 py-3 ${getHeaderStyle()}`}
        >
          <div>
            <h2 className="text-lg font-semibold">
              Pesanan {OrderStatusLabel[status]}
            </h2>
            {status === OrderStatus.SHIPPED ? (
              <p className="text-sm">
                Mohon tunggu pesanan anda sedang dikirim kurir
              </p>
            ) : status === OrderStatus.PROCESSING ? (
              <p className="text-sm">Mohon tunggu pesanan anda sedang kami proses</p>
            ) : (
              <p className="text-sm">Terima kasih telah berbelanja di Regar Mart</p>
            )}
          </div>

          {/* Gambar Truck hanya untuk dikirim */}
          {status === OrderStatus.SHIPPED && (
            <Image
              src="/trukorder.png"
              alt="Truck"
              width={50}
              height={50}
              className="mr-3 sm:mr-6"
            />
          )}
        </div>

        {/* BODY */}
        <div className="p-4 sm:p-6">
          {/* Informasi Pesanan */}
          <div className="py-2">
            <h3 className="font-bold text-gray-800 text-sm mb-2">
              Informasi Pesanan
            </h3>
            <div className="grid grid-cols-2 text-sm">
              <span>No. Pesanan:</span>
              <span className="text-right font-medium">{orderNumber}</span>
            </div>
            <div className="grid grid-cols-2 text-sm mt-1">
              <span>Metode Pembayaran:</span>
              <span className="text-right font-medium">{paymentMethod}</span>
            </div>
          </div>

          {/* Alamat */}
          <div className="py-4 border-t border-gray-200">
            <h2 className="font-bold text-sm text-black mb-3">
              Alamat Pengiriman
            </h2>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              <p className="font-medium text-sm text-black">{address.nama}</p>
              {address.utama && (
                <span className="bg-green-100 text-green-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Utama
                </span>
              )}
            </div>
            <div className="pl-7 mt-2">
              <p className="font-medium text-sm text-black">
                {address.nama}
                <span className="mx-2 text-[#8F8F8F]">|</span>
                <span className="text-[#8F8F8F]">{address.telp}</span>
              </p>
              <p className="text-xs text-[#8F8F8F]">{address.alamat}</p>
            </div>
          </div>

          {/* Produk */}
          <div className="py-4 border-t border-gray-200">
            {(showAll ? products : products.slice(0, 1)).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between border-b border-gray-100 py-2 last:border-none"
              >
                <div className="flex gap-3 items-center">
                  <div className="w-[60px] h-[60px] rounded-md overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={60}
                      height={60}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-gray-500">Qty: x{p.qty}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold">{p.price}</p>
              </div>
            ))}

            {products.length > 1 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-blue-600 text-sm font-medium mt-2"
              >
                {showAll ? "Sembunyikan" : "Lihat selengkapnya"}
              </button>
            )}
          </div>

          {/* Total */}
          <div className="py-4 flex justify-end text-sm gap-1">
            <span className="text-black">Total pesanan :</span>
            <span className="font-bold text-black">{total}</span>
          </div>

          {/* Tombol */}
          {status === OrderStatus.PROCESSING ? (
            <button
              onClick={onClose}
              className="w-full bg-[#26A81D] hover:bg-green-700 text-white font-semibold rounded-lg h-10"
            >
              Kembali
            </button>
          ) : status === OrderStatus.SHIPPED ? (
            <div className="flex gap-3">
              <button
                disabled
                className="flex-1 bg-green-100 hover:bg-green-200 text-green-500 font-semibold rounded-lg h-10"
              >
                Selesaikan Pesanan
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-[#26A81D] hover:bg-green-700 text-white font-semibold rounded-lg h-10"
              >
                Kembali
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1  bg-green-100 hover:bg-green-200 text-green-500 font-semibold rounded-lg h-10"
              >
                Kembali
              </button>
              <button className="flex-1 bg-[#26A81D] hover:bg-green-700 text-white font-semibold rounded-lg h-10">
                Beli Lagi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderConfirm;