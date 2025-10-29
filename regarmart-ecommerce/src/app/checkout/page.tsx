"use client";
import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import DaftarAlamat from "@/components/DaftarAlamat";
import { Alamat } from "@/types/alamat";
import CheckoutNavbar from "@/components/NavCheckout";
import OrderConfirm from "@/components/OrderConfirm";
import { OrderStatus, PaymentMethod } from "@/types/order";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import useOrderSocket from "@/hooks/useOrderSocket";
import AuthCheck from "@/components/AuthCheck";

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const [openOrderConfirm, setOpenOrderConfirm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.COD
  );

  const [alamatAktif, setAlamatAktif] = useState<Alamat | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const [openAlamat, setOpenAlamat] = useState(false);
  const [qrisUrl, setQrisUrl] = useState<string | null>(null);

  const ongkir = 20000;
  const diskon = 0;

  useOrderSocket(order?.id, (status) => {
    if (status === "PROCESSING") {
      setQrisUrl(null);
      setOpenOrderConfirm(true);
    } else if (status === "CANCELED") {
      setQrisUrl(null);
      alert("Pembayaran gagal atau dibatalkan ❌");
    }
  });

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        setLoading(true);
        const [cartResponse, addressResponse] = await Promise.all([
          fetch("/api/cart"),
          fetch("/api/profile/address-primary")
        ]);

        if (!cartResponse.ok || !addressResponse.ok) {
          throw new Error("Failed to fetch checkout data");
        }

        const cartData = await cartResponse.json();
        const addressData = await addressResponse.json();

        setOrder(cartData);
        setAlamatAktif(addressData);
      } catch (error) {
        console.error("Error fetching checkout data:", error);
        setOrder(null);
        setAlamatAktif(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutData();
  }, []);

  const processCheckout = async () => {
  if (!alamatAktif?.id) {
    alert("Silakan pilih alamat pengiriman terlebih dahulu");
    return;
  }

  try {
    setProcessingCheckout(true);

    const response = await fetch("/api/cart/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        paymentMethod,
        addressId: alamatAktif.id
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to process checkout");
    }

<<<<<<< HEAD
    // Untuk QRIS, tampilkan QR Code
    if (paymentMethod === PaymentMethod.QRIS && result.midtrans?.qrisUrl) {
      setQrisUrl(result.midtrans.qrisUrl);
      return;
    }

    // Untuk COD, update order state dengan data yang benar
    if (paymentMethod === PaymentMethod.COD) {
      setOrder(result);
      setOpenOrderConfirm(true);
    }
  } catch (error) {
    console.error("Checkout error:", error);
    alert("Terjadi kesalahan saat memproses checkout");
  } finally {
    setProcessingCheckout(false);
  }
};

  // Hitung total
  const totalHarga = order?.totalAmount || 0;
  const totalPembayaran = totalHarga - diskon;
=======
  // Perhitungan total
  const totalHargaProduk =
    order?.orderItems?.reduce(
      (sum: number, item: any) => sum + Number(item.unitPrice) * item.quantity,
      0
    ) || 0;
  const totalPembayaran = totalHargaProduk + ongkir - diskon;
>>>>>>> 0173f99e8a3beeba0565631ed321b5e5eb2a7724

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!order || !alamatAktif) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Data tidak ditemukan</p>
      </div>
    );
  }

  return (
    <AuthCheck role="CUSTOMER">
      <div className="min-h-screen bg-gray-100 max-sm:bg-white flex flex-col">
        <CheckoutNavbar />

        <div className="p-6 max-w-6xl mx-auto flex-1 w-full pb-24 md:pb-6">
          <h1 className="text-lg font-bold mb-3">Checkout Produk</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Kolom Kiri */}
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
                      {alamatAktif.recipientName}
                    </p>
                    {alamatAktif.isPrimary && (
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
                    {alamatAktif.recipientName}
                    <span className="after:content-['|'] after:mx-1 text-[#8F8F8F]"></span>
                    <span className="text-[#8F8F8F]">
                      {alamatAktif.phoneNumber}
                    </span>
                  </p>
                  <p className="text-[11px] text-[#8F8F8F]">
                    {alamatAktif.fullAddress}
                  </p>
                </div>

                {/* Strip Hijau-Oren */}
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

              {/* Daftar Produk */}
              {order?.orderItems?.map((item: any, idx: number) => (
                <div
                  key={item.id}
                  className="bg-white shadow rounded-xl p-3 max-sm:shadow-none max-sm:rounded-none max-sm:border-b border-gray-200"
                >
                  <h3 className="text-xs font-semibold mb-2">
                    Pesanan {idx + 1}
                  </h3>
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        item.product?.imageUrl?.[0] ||
                        "/placeholder-product.png"
                      }
                      alt={item.product?.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-xs">
                        {item.product?.name}
                      </p>
                      <p className="text-green-600 text-[10px]">
                        qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-xs">
                      {item.quantity} x Rp
                      {Number(item.unitPrice).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}

              {/* Metode Pembayaran - Mobile */}
              <div className="md:hidden bg-white p-3 mt-3">
                <h2 className="font-semibold text-sm mb-2">
                  Metode Pembayaran
                </h2>
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

              {/* Ringkasan Pembayaran - Mobile */}
              <div className="md:hidden bg-white p-3 mt-3">
                <h2 className="font-semibold text-sm mb-2">
                  Ringkasan Pembayaran
                </h2>

                <div className="pt-1 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>
                      Total harga ({order?.orderItems?.length || 0} Produk)
                    </span>
                    <span>Rp{totalHarga.toLocaleString("id-ID")}</span>
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

            {/* Kolom Kanan - Desktop */}
            <div className="hidden md:block">
              <div className="bg-white shadow rounded-xl p-4 space-y-3 border border-gray-200">
                <h2 className="font-semibold text-sm mb-1">
                  Metode Pembayaran
                </h2>
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
                    <span>
                      Total harga ({order?.orderItems?.length || 0} Produk)
                    </span>
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
                  onClick={processCheckout}
                  disabled={
                    processingCheckout || 
                    !order?.orderItems?.length ||
                    !alamatAktif
                  }
                  className="bg-green-600 text-white px-6 h-11 rounded-lg text-medium font-semibold w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {processingCheckout ? "Memproses..." : "Konfirmasi"}
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
            onClick={processCheckout}
            disabled={
              processingCheckout || 
              !order?.orderItems?.length ||
              !alamatAktif
            }
            className="bg-green-600 text-white px-4 h-11 rounded-lg text-medium font-semibold flex-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {processingCheckout ? "Memproses..." : "Konfirmasi"}
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

        {/* Modal QRIS */}
        {qrisUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg">
              <h2 className="text-lg font-bold mb-4">
                Scan QRIS untuk Pembayaran
              </h2>
              <img
                src={qrisUrl}
                alt="QRIS"
                className="w-64 h-64 object-contain"
              />
              <button
                onClick={() => setQrisUrl(null)}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* Order Confirm Modal */}
        <OrderConfirm
<<<<<<< HEAD
          orderNumber={`#INV-${order?.id?.toString().padStart(4, "0") || "0000"}`}
=======
          orderNumber={`#INV-${
            order?.id?.toString().padStart(4, "0") || "0000"
          }`}
>>>>>>> 0173f99e8a3beeba0565631ed321b5e5eb2a7724
          status={OrderStatus.PROCESSING}
          paymentMethod={paymentMethod}
          products={
            order?.orderItems?.map((item: any) => ({
              id: item.productId || item.id,
              name: item.product?.name,
              qty: item.quantity,
              price: `Rp${Number(item.unitPrice).toLocaleString("id-ID")}`,
              image: item.product?.imageUrl?.[0] || "/placeholder-product.png",
            })) || []
          }
          total={`Rp${totalPembayaran.toLocaleString("id-ID")}`}
          address={{
<<<<<<< HEAD
            id: alamatAktif.id.toString(),
            nama: alamatAktif.recipientName || alamatAktif.nama || "Nama tidak tersedia",
            telp: alamatAktif.phoneNumber || alamatAktif.telp || "Telepon tidak tersedia",
            alamat: alamatAktif.fullAddress || alamatAktif.alamat || "Alamat tidak tersedia",
            utama: alamatAktif.isPrimary || alamatAktif.utama || false,
          }}
          contact={`${alamatAktif.recipientName || alamatAktif.nama} | ${alamatAktif.phoneNumber || alamatAktif.telp}`}
=======
            nama: alamatAktif.reciptName, // Mapped to address.nama
            telp: alamatAktif.phoneNumber, // Mapped to address.telp
            alamat: alamatAktif.fullAdress, // Mapped to address.alamat
            utama: alamatAktif.isPrimaary, // Mapped to address.utama
            // Tambahkan properti wajib lain dari type Alamat jika ada, misal: id: alamatAktif.id
            id: alamatAktif.id,
          }}
          contact={`${alamatAktif.reciptName} | ${alamatAktif.phoneNumber}`}
>>>>>>> 0173f99e8a3beeba0565631ed321b5e5eb2a7724
          open={openOrderConfirm}
          onClose={() => {
            setOpenOrderConfirm(false);
            if (paymentMethod === PaymentMethod.COD) {
              router.push("/profil/riwayat-transaksi");
            }
          }}
        />
          
      </div>
    </AuthCheck>
  );
};

export default CheckoutPage;
