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
      <div className="bg-white rounded-2xl w-[546px] shadow-[0_0_54px_rgba(0,0,0,0.3)] max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div
          className={`px-5 py-4 text-white flex justify-between items-center ${
            status === "Selesai"
              ? "bg-[linear-gradient(145deg,#6EC568_13.92%,#26A81D_87.84%)]"
              : "bg-gradient-to-b from-[#FFA04F] to-[#FF8A25]"
          }`}
        >
          <div>
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

          {/* Icon status */}
          <div className="w-13 h-13 flex items-center justify-center rounded-full bg-white/30">
            {status === "Selesai" ? (
              <Check className="w-13 h-13 text-white" strokeWidth={3} />
            ) : (
              <Clock className="w-13 h-13 text-white" strokeWidth={3} />
            )}
          </div>
        </div>

        {/* Informasi Pesanan */}
        <div className="p-3 mb-1 bg-white">
          <h3 className="font-bold text-gray-800 text-sm">Informasi Pesanan</h3>

          <div className="grid grid-cols-2 text-sm mt-1">
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

        <hr className="border-2 border-gray-100 my-2" />

        {/* Alamat Pengiriman */}
        <div className="bg-white p-4">
          <h2 className="font-bold text-sm text-black mb-4">ALAMAT PENGIRIMAN</h2>
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-green-600" />
            <p className="font-medium text-[15px] text-black">{address.nama}</p>
            {address.utama && (
              <span className="bg-green-100 text-green-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Utama
              </span>
            )}
          </div>
          <div className="pl-8 mt-2">
            <p className="font-medium text-sm text-black">
              <span className="after:content-['|'] after:mx-2 text-[#8F8F8F]">
                {address.nama}
              </span>
              <span className="font-medium text-[14px] text-[#8F8F8F]">{address.telp}</span>
            </p>
            <p className="font-normal text-[13px] text-[#8F8F8F]">{address.alamat}</p>
          </div>
        </div>

        <hr className="border-2 border-gray-100 my-2" />

        {/* Produk */}
        <div className="mb-4 bg-white p-4">
          {(showAll ? products : products.slice(0, 1)).map((p) => (
            <div
              key={p.id}
              className="w-[475px] h-[85px] flex items-center justify-between border-b border-gray-100 py-2 last:border-none"
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
        <div className="flex items-center justify-end text-sm mb-5 px-5 gap-1">
          <span className="text-black">Total pesanan :</span>
          <span className="font-bold text-black">{total}</span>
        </div>

        {/* Tombol */}
        <div className="flex justify-between px-5 pb-5">
          <button
            onClick={onClose}
            className="bg-green-100 text-green-600 font-semibold rounded-lg w-[231px] h-10 flex items-center justify-center"
          >
            Kembali beranda
          </button>

          {status === "Selesai" ? (
            <button className="bg-green-600 text-white font-semibold rounded-lg w-[231px] h-10 flex items-center justify-center">
              Beli lagi
            </button>
          ) : (
            <button className="bg-green-600 text-white font-semibold rounded-lg w-[231px] h-10 flex items-center justify-center">
              Konfirmasi
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderConfirm;
