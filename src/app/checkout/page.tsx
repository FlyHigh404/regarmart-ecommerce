"use client";
import React, { useState } from "react";
import { MapPin } from "lucide-react";
import DaftarAlamat from "@/components/DaftarAlamat";
import Footer from "@/components/Footer";

type Alamat = {
  id: number;
  nama: string;
  telp: string;
  alamat: string;
  utama?: boolean;
};

const CheckoutPage: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [alamatAktif, setAlamatAktif] = useState<Alamat>({
    id: 1,
    nama: "Team Genesis",
    telp: "0895360577489",
    alamat:
      "Jl. Merpati No.40ab, Kepuh, Betro, Kec. Sedati, Kabupaten Sidoarjo, Jawa Timur 61253",
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
      name: "Beras Sumo | Beras Premium | 3 Kilogram",
      price: 52500,
      qty: 1,
      stock: 8,
      img: "/susu.png",
    },
  ];

  const totalHarga = orders.reduce((acc, item) => acc + item.price * item.qty, 0);
  const diskon = 4500;
  const ongkir = 2500;
  const totalPembayaran = totalHarga - diskon + ongkir;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="w-full h-18 bg-white -z-10">
        <div className="max-w-6xl mx-auto flex items-center p-4">
          <img src="Logo.png" alt="Regar Mart Logo" className="h-10 mr-2" />
          <span className="border-l h-6 mx-2 border-green-500"></span>
          <p className="text-green-600 font-semibold">Checkout</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-xl font-bold mb-4">Checkout Produk</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* KIRI */}
          <div className="md:col-span-2 space-y-4">
            {/* Alamat Pengiriman */}
            <div className="bg-white shadow rounded-xl p-4">
              <h2 className="font-bold text-sm font-jakarta text-[#8F8F8F] mb-4">
                ALAMAT PENGIRIMAN
              </h2>
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-green-600" />
                  <p className="font-medium text-[15px] font-jakarta text-[#8F8F8F]">
                    {alamatAktif.nama}
                  </p>
                  {alamatAktif.utama && (
                    <span className="bg-green-100 text-green-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Utama
                    </span>
                  )}
                </div>
                <button
                  className="text-green-600 font-semibold hover:underline"
                  onClick={() => setOpenAlamat(true)}
                >
                  Edit
                </button>
              </div>

              <div className="pl-8">
                <p className="font-medium text-sm font-jakarta text-black">
                  {alamatAktif.nama}
                  <span className="after:content-['|'] after:mx-2 text-[#8F8F8F]"></span>
                  <span className="font-medium text-[14px] font-jakarta text-[#8F8F8F]">
                    {alamatAktif.telp}
                  </span>
                </p>
                <p className="font-normal text-[13px] font-jakarta text-[#8F8F8F]">
                  {alamatAktif.alamat}
                </p>
              </div>
            </div>

            {/* Pesanan */}
            {orders.map((item, idx) => (
              <div key={item.id} className="bg-white shadow rounded-xl p-4">
                <h3 className="text-sm font-semibold mb-2">Pesanan {idx + 1}</h3>
                <div className="flex items-center gap-4">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-green-600 text-xs">Stok: {item.stock}</p>
                  </div>
                  <p className="font-semibold text-sm">
                    {item.qty} x Rp{item.price.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* KANAN */}
          <div className="bg-white shadow rounded-xl p-4 space-y-4">
            <h2 className="font-semibold mb-2">Metode Pembayaran</h2>

            <div>
              {/* QRIS */}
              <label className="flex items-center justify-between cursor-pointer py-2">
                <div className="flex items-center gap-3">
                  <img src="/qris.svg" alt="QRIS" className="w-8 h-8 object-contain" />
                  <span className="text-sm font-medium">QRIS</span>
                </div>
                <input
                  type="radio"
                  name="payment"
                  value="QRIS"
                  checked={paymentMethod === "QRIS"}
                  onChange={() => setPaymentMethod("QRIS")}
                  className="w-4 h-4 accent-green-600"
                />
              </label>

              <hr className="border-gray-200 my-3" />

              {/* COD */}
              <label className="flex items-center justify-between cursor-pointer py-2">
                <div className="flex items-center gap-3">
                  <img src="/cod.svg" alt="COD" className="w-8 h-8 object-contain" />
                  <span className="text-sm font-medium">COD</span>
                </div>
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="w-4 h-4 accent-green-600"
                />
              </label>

              <hr className="border-gray-200 border-dashed my-2" />
            </div>

            {/* Detail Pembayaran */}
            <div className="pt-2 text-sm space-y-3">
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

            <div className="flex justify-between font-bold text-lg">
              <span>Total Pembayaran</span>
              <span>Rp{totalPembayaran.toLocaleString("id-ID")}</span>
            </div>

            <button className="w-full bg-green-600 text-white py-2 rounded-xl font-semibold">
              Konfirmasi
            </button>
          </div>
        </div>
      </div>

      {/* Modal Daftar Alamat */}
      <DaftarAlamat
        open={openAlamat}
        setOpen={setOpenAlamat}
        onSelectAlamat={(alamat: Alamat) => setAlamatAktif(alamat)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CheckoutPage;
