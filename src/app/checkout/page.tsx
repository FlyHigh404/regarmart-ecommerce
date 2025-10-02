"use client";
import React, { useState } from "react";
import { MapPin } from "lucide-react";
import DaftarAlamat from "@/components/DaftarAlamat";
import { Alamat } from "@/types/alamat";
import CheckoutNavbar from "@/components/NavCheckout";
import OrderConfirm from "@/components/OrderConfirm";
import { OrderStatus, PaymentMethod } from "@/types/order";
import Footer from "@/components/Footer";

const CheckoutPage: React.FC = () => {
  const [openOrderConfirm, setOpenOrderConfirm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.COD
  );

  const [alamatAktif, setAlamatAktif] = useState<Alamat>({
    id: 1,
    label: "Rumah",
    nama: "Team Genesis",
    telp: "0895360577489",
    alamat:
      "Jl. Merpati No.40ab, Kepuh, Betro, Kec. Sedati, Kabupaten Sidoarjo, Jawa Timur 61253, Indonesia",
    catatan: "Dekat Masjid, Warna cat rumah hijau",
    utama: true,
  });

  const [openAlamat, setOpenAlamat] = useState(false);

  const orders = [
    {
      id: 1,
      name: "Beras Raja Platinum | Beras Slyp Super Quality | 10 Kilogram",
      price: 168500,
      qty: 1,
      stock: 29,
      img: "/susu.png",
    },
    {
      id: 2,
      name: "Beras Fortune | Beras Premium | 5 Kilogram",
      price: 73500,
      qty: 1,
      stock: 120,
      img: "/susu.png",
    },
    {
      id: 3,
      name: "Beras Sania | Beras Premium | 3 Kilogram",
      price: 75000,
      qty: 1,
      stock: 100,
      img: "/susu.png",
    },
  ];

  const totalHarga = orders.reduce((acc, item) => acc + item.price * item.qty, 0);
  const diskon = 4500;
  const ongkir = 2500;
  const totalPembayaran = totalHarga - diskon + ongkir;

  return (
    <div className="min-h-screen bg-gray-100 max-sm:bg-white flex flex-col">
      {/* Navbar Checkout */}
      <CheckoutNavbar />

      {/* Konten Utama */}
      <div className="p-6 max-w-6xl mx-auto flex-1 w-full pb-24 md:pb-6">
        <h1 className="text-lg font-bold mb-3">Checkout Produk</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ==================== KIRI ==================== */}
          <div className="md:col-span-2 space-y-3">
            {/* Alamat Pengiriman */}
            <div className="bg-white shadow rounded-xl p-4 max-sm:shadow-none max-sm:rounded-none max-sm:border-b border-gray-200 relative overflow-hidden">
              <h2 className="font-bold text-xs text-[#8F8F8F] mb-2">
                ALAMAT PENGIRIMAN
              </h2>
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <p className="font-medium text-xs text-[#8F8F8F]">
                    {alamatAktif.nama}
                  </p>
                  {alamatAktif.utama && (
                    <span className="bg-green-100 text-green-600 text-[10px] font-medium px-2 py-0.5 rounded-full">
                      Utama
                    </span>
                  )}
                </div>
                <button
                  className="text-green-600 text-xs font-semibold hover:underline"
                  onClick={() => setOpenAlamat(true)}
                >
                  Edit
                </button>
              </div>

              <div className="pl-6 mt-1">
                <p className="font-medium text-xs text-black">
                  {alamatAktif.nama}
                  <span className="after:content-['|'] after:mx-1 text-[#8F8F8F]"></span>
                  <span className="text-[#8F8F8F]">{alamatAktif.telp}</span>
                </p>
                <p className="text-[11px] text-[#8F8F8F]">{alamatAktif.alamat}</p>
              </div>

              {/* Strip Hijau-Oren di bawah */}
              <div
                className="absolute bottom-0 left-0 w-full h-1 rounded-b-xl"
                style={{
                   backgroundImage: `
                    repeating-linear-gradient(
                      90deg,
                      #F97316 0 18px,     
                      white 18px 20px,    
                      #22C55E 20px 38px,  
                      white 38px 40px     
                    )
                  `,
                      }}
                  />
              </div>


            {/* Pesanan */}
            {orders.map((item, idx) => (
              <div
                key={item.id}
                className="bg-white shadow rounded-xl p-3 max-sm:shadow-none max-sm:rounded-none max-sm:border-b border-gray-200"
              >
                <h3 className="text-xs font-semibold mb-2">Pesanan {idx + 1}</h3>
                <div className="flex items-center gap-2">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-xs">{item.name}</p>
                    <p className="text-green-600 text-[10px]">
                      qty: {item.qty}
                    </p>
                  </div>
                  <p className="font-semibold text-xs">
                    {item.qty} x Rp{item.price.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}

            {/* ==================== MOBILE PAYMENT METHOD ==================== */}
            <div className="md:hidden bg-white p-3 mt-3">
              <h2 className="font-semibold text-sm mb-2">Metode Pembayaran</h2>
              <div className="text-xs space-y-3">
                <label className="flex items-center justify-between cursor-pointer p-2 max-sm:border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <img
                      src="/qris.svg"
                      alt="QRIS"
                      className="w-6 h-6 object-contain"
                    />
                    <span>QRIS</span>
                  </div>
                  <input
                    type="radio"
                    name="payment-mobile"
                    value={PaymentMethod.QRIS}
                    checked={paymentMethod === PaymentMethod.QRIS}
                    onChange={() => setPaymentMethod(PaymentMethod.QRIS)}
                    className="w-3 h-3 accent-green-600"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer max-sm:border-b border-gray-200 p-2">
                  <div className="flex items-center gap-2">
                    <img
                      src="/cod.svg"
                      alt="COD"
                      className="w-6 h-6 object-contain"
                    />
                    <span>COD</span>
                  </div>
                  <input
                    type="radio"
                    name="payment-mobile"
                    value={PaymentMethod.COD}
                    checked={paymentMethod === PaymentMethod.COD}
                    onChange={() => setPaymentMethod(PaymentMethod.COD)}
                    className="w-3 h-3 accent-green-600"
                  />
                </label>
              </div>
            </div>

            {/* ==================== MOBILE PAYMENT DETAIL ==================== */}
            <div className="md:hidden bg-white p-3 mt-3">
              <h2 className="font-semibold text-sm mb-2">Ringkasan Pembayaran</h2>

              <div className="pt-1 text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Total harga ({orders.length} Produk)</span>
                  <span>Rp{totalHarga.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Potongan Diskon</span>
                  <span>-Rp{diskon.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ongkos Kirim</span>
                  <span>Rp{ongkir.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-sm w-full mt-2">
                <span>Total Pembayaran</span>
                <span>Rp{totalPembayaran.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>

          {/* ==================== KANAN (DESKTOP) ==================== */}
          <div className="hidden md:block">
            <div className="bg-white shadow rounded-xl p-4 space-y-3 border border-gray-200">
              <h2 className="font-semibold text-sm mb-1">Metode Pembayaran</h2>
              <div className="text-xs">
                <label className="flex items-center justify-between cursor-pointer py-1">
                  <div className="flex items-center gap-2">
                    <img
                      src="/qris.svg"
                      alt="QRIS"
                      className="w-6 h-6 object-contain"
                    />
                    <span>QRIS</span>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    value={PaymentMethod.QRIS}
                    checked={paymentMethod === PaymentMethod.QRIS}
                    onChange={() => setPaymentMethod(PaymentMethod.QRIS)}
                    className="w-3 h-3 accent-green-600"
                  />
                </label>

                <hr className="border-gray-200 my-2" />

                <label className="flex items-center justify-between cursor-pointer py-1">
                  <div className="flex items-center gap-2">
                    <img
                      src="/cod.svg"
                      alt="COD"
                      className="w-6 h-6 object-contain"
                    />
                    <span>COD</span>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    value={PaymentMethod.COD}
                    checked={paymentMethod === PaymentMethod.COD}
                    onChange={() => setPaymentMethod(PaymentMethod.COD)}
                    className="w-3 h-3 accent-green-600"
                  />
                </label>
              </div>

              {/* Detail Pembayaran */}
              <div className="pt-2 text-xs space-y-2">
                <div className="flex justify-between">
                  <span>Total harga ({orders.length} Produk)</span>
                  <span>Rp{totalHarga.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Potongan Diskon</span>
                  <span>-Rp{diskon.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ongkos Kirim</span>
                  <span>Rp{ongkir.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-sm w-full">
                <span>Total Pembayaran</span>
                <span>Rp{totalPembayaran.toLocaleString("id-ID")}</span>
              </div>
              <button
                onClick={() => setOpenOrderConfirm(true)}
                className="bg-green-600 text-white px-6 h-11 rounded-lg text-medium font-semibold w-full"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Desktop */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Sticky Bottom Mobile */}
      <div className="md:hidden bg-white border-t border-gray-200 p-3 fixed bottom-0 left-0 right-0 flex justify-between items-center">
        <div className="pr-2">
          <p className="text-[10px] text-gray-500">Total</p>
          <p className="text-sm font-bold text-green-600">
            Rp{totalPembayaran.toLocaleString("id-ID")}
          </p>
        </div>
        <button
          onClick={() => setOpenOrderConfirm(true)}
          className="bg-green-600 text-white px-4 h-11 rounded-lg text-medium font-semibold w-[160px]"
        >
          Konfirmasi
        </button>
      </div>

      {/* Modal Daftar Alamat */}
      <DaftarAlamat
        open={openAlamat}
        setOpen={setOpenAlamat}
        onSelectAlamat={(alamat: Alamat) => {
          setAlamatAktif(alamat);
        }}
      />

      {/* Order Confirm Modal */}
      <OrderConfirm
        orderNumber="#INV-0010"
        status={OrderStatus.PROCESSING}
        paymentMethod={paymentMethod}
        products={orders.map((o) => ({
          id: o.id.toString(),
          name: o.name,
          qty: o.qty,
          price: `Rp${o.price.toLocaleString("id-ID")}`,
          image: o.img,
        }))}
        total={`Rp${totalPembayaran.toLocaleString("id-ID")}`}
        address={alamatAktif}
        contact={`${alamatAktif.nama} | ${alamatAktif.telp}`}
        open={openOrderConfirm}
        onClose={() => setOpenOrderConfirm(false)}
      />
    </div>
  );
};

export default CheckoutPage;
