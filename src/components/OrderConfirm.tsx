"use client";
import Image from "next/image";
import { useState } from "react";
import { Truck, MapPin, Check, Clock } from "lucide-react";
import { Alamat } from "@/types/alamat";
import { PaymentMethod, OrderStatus } from "@/types/order";

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

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 font-jakarta">
      <div
        className="
          bg-white rounded-xl shadow-lg
          w-[95%] sm:w-[650px] max-h-[85vh] overflow-y-auto
          relative divide-y divide-gray-300
        "
      >
        {/* Header */}
        <div
          className={`
            w-full flex justify-between items-center text-white rounded-t-xl
            ${status === "Selesai"
              ? "bg-[linear-gradient(145deg,#6EC568_13.92%,#26A81D_87.84%)]"
              : "bg-gradient-to-b from-[#FFA04F] to-[#FF8A25]"}
          `}
        >
          <div className="px-4 sm:px-6 py-3">
            {status === "Selesai" ? (
              <>
                <h2 className="text-lg font-semibold">Pesanan selesai</h2>
                <p className="text-sm">Terimakasih telah berbelanja di Regar Mart</p>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold">Pesanan {status}</h2>
                <p className="text-sm">Mohon tunggu pesanan anda sedang kami proses</p>
              </>
            )}
          </div>
          <div className="w-7 h-7 flex items-center justify-center rounded-full bg-white/30 mr-4">
            {status === "Selesai" ? (
              <Check className="w-7 h-7 text-white" strokeWidth={3} />
            ) : (
              <Clock className="w-7 h-7 text-white" strokeWidth={3} />
            )}
          </div>
        </div>

      
        <div className="p-4 sm:p-6">
          {/* Informasi Pesanan */}
          <div className="py-2">
            <h3 className="font-bold text-gray-800 text-sm mb-2">Informasi Pesanan</h3>
            <div className="grid grid-cols-2 text-sm">
              <span>No. Pesanan:</span>
              <span className="text-right font-medium">{orderNumber}</span>
            </div>
            <div className="grid grid-cols-2 text-sm mt-1">
              <span>Metode Pembayaran:</span>
              <span className="text-right font-medium">{paymentMethod}</span>
            </div>

            <div className="flex justify-end items-center gap-2 text-green-600 text-sm mt-2">
              {status === "Selesai" ? (
                <div className="flex items-center gap-1 cursor-pointer">
                  <span>Pesanan tiba di alamat tujuan</span>
                  <span className="font-bold">{">"}</span>
                </div>
              ) : (
                <>
                  <Truck className="w-4 h-4" />
                  <span>Estimasi waktu 1 jam</span>
                </>
              )}
            </div>
          </div>

          {/* Alamat Pengiriman */}
          <div className="py-4 border-t-6 border-gray-100">
            <h2 className="font-bold text-sm text-black mb-3">Alamat Pengiriman</h2>
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
          <div className="py-4 border-t-6 border-gray-100">
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
          <div className="text-[13px] sm:text-[16px] pt-4 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-green-100 text-green-600 font-semibold rounded-lg h-10"
            >
              Kembali beranda
            </button>
            {status === "Selesai" ? (
              <button className="flex-1 bg-green-600 text-white font-semibold rounded-lg h-10">
                Beli lagi
              </button>
            ) : (
              <button className="flex-1 bg-green-600 text-white font-semibold rounded-lg h-10">
                Konfirmasi
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirm;