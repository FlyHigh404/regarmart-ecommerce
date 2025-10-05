"use client"
import { useState } from "react"
import { ArrowLeft, Phone, MapPin, Truck } from "lucide-react"
import { useRouter } from "next/navigation"
import AdminLayout from "../../AdminLayout"

// Sample order data
const orderData = {
  "#INV-0015": {
    id: "#INV-0015",
    customer: {
      name: "Leasie Watson",
      avatar: "/woman-profile.png",
      phone: "089536057489",
      address: "Jl. Merpati No.40ab, Kepuh, Betro, Kec. Sedati, Kabupaten Sidoarjo, Jawa Timur 61253, Indonesia",
    },
    status: "Dikirim",
    items: [
      { id: "3219021", name: "Beras Raja Platinum | Beras Slyp Super Quality | 10 Kilogram", price: "Rp168.500", quantity: 1, image: "/rice-bag-premium.jpg" },
      { id: "3219021", name: "Beras Fortune | Beras Premium | 5 Kilogram", price: "Rp73.500", quantity: 1, image: "/rice-bag-fortune.jpg" },
      { id: "3219021", name: "Beras Sumo | Beras Premium | 3 Kilogram", price: "Rp52.500", quantity: 1, image: "/rice-bag-sumo.jpg" },
    ],
    payment: {
      subtotal: "Rp294.500",
      discount: "-Rp4.500",
      shipping: "Rp2.500",
      method: "COD",
      total: "Rp292.500",
    },
    date: "14-07-2025 | 08:55",
  },
}

const PesananDetailPage = () => {
  const router = useRouter()
  // Langsung ambil order pertama untuk preview
  const order = orderData["#INV-0015"]

  return (
    <AdminLayout>
      <main className="flex-1 bg-gray-50 pt-4 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header dengan tombol Kembali */}
          <div className="flex items-center gap-3 mb-6">
            <button className="w-10 h-10 border-2 border-green-500 rounded-full flex items-center justify-center hover:bg-green-50 transition-colors">
              <ArrowLeft size={18} className="text-green-500" />
            </button>
            <h1 className="text-lg font-medium text-green-600">Kembali</h1>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Detail Pesanan */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pesanan (3)</h2>
              <p className="text-base font-medium text-gray-700 mb-6">No Pesanan : {order.id}</p>

              {/* Order Items */}
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 py-4 border-b border-gray-100 last:border-b-0">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="w-8 h-8 bg-yellow-400 rounded"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm mb-1 leading-tight">{item.name}</h4>
                      <p className="text-xs text-gray-500 mb-2">ID : {item.id}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">{item.price}</span>
                        <span className="text-xs text-gray-500">Qty : x{item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detail Pembayaran */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Detail pembayaran</h2>
                <p className="text-sm text-gray-500">{order.date}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Sub total</span>
                  <span className="font-medium text-gray-900">{order.payment.subtotal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Potongan Diskon</span>
                  <span className="font-medium text-green-600">{order.payment.discount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Ongkos kirim</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400 line-through">Rp22.500</span>
                    <span className="font-medium text-gray-900">{order.payment.shipping}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Metode pembayaran</span>
                  <span className="font-medium text-gray-900">{order.payment.method}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total pembayaran</span>
                    <span className="text-lg font-semibold text-gray-900">{order.payment.total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section - Status dan Customer Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Box Status dan Button Tugaskan Kurir */}
              <div className="bg-white rounded-lg shadow-sm p-6 lg:pt-8 space-y-4">
                {/* Box Sedang Proses */}
                <div className="bg-yellow-300 text-center py-6 px-4 rounded-2xl relative">
                  <div className="flex items-center justify-center">
                    <span className="font-bold text-xl text-white">SEDANG PROSES</span>
                  </div>
                  {/* Clock Icon */}
                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-yellow-200 bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-white rounded-full relative">
                      <div className="absolute top-1 left-1/2 w-0.5 h-2 bg-white transform -translate-x-1/2"></div>
                      <div className="absolute top-1/2 left-1/2 w-1.5 h-0.5 bg-white transform -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                  </div>
                </div>

                {/* Button Tugaskan Kurir */}
                <div className="space-y-3">
                  {/* Button Tugaskan Kurir */}
                  <button className="w-full bg-indigo-50 border-2 border-indigo-500 hover:bg-indigo-100 text-indigo-600 font-bold py-4 px-4 rounded-3xl transition-colors">
                    Tugaskan kurir
                  </button>

                  {/* Button Selesaikan Pesanan - Disabled */}
                  <button
                    disabled
                    className="w-full bg-gray-200 text-gray-400 font-bold py-4 px-4 rounded-3xl cursor-not-allowed"
                  >
                    Selesaikan pesanan
                  </button>

                  {/* Button Batalkan Pesanan */}
                  <button className="w-full bg-red-50 border-2 border-red-500 hover:bg-red-100 text-red-500 font-bold py-4 px-4 rounded-3xl transition-colors">
                    Batalkan pesanan
                  </button>
                </div>
              </div>

              {/* Detail Pelanggan */}
              <div className="bg-white rounded-lg shadow-sm p-8 relative">
                {/* Profile Image - Top Right */}
                <div className="absolute top-6 right-6 w-24 h-24 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden border-4 border-white shadow-md">
                  {order.customer.avatar ? (
                    <img
                      src={order.customer.avatar}
                      alt={order.customer.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 font-bold text-2xl">
                      {order.customer.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Customer Name */}
                <div className="mb-8 pr-28">
                  <h2 className="text-3xl font-bold text-gray-900 mb-1">{order.customer.name}</h2>
                  <p className="text-base text-gray-500">Pelanggan</p>
                </div>

                {/* Contact Info */}
                <div className="space-y-6">
                  {/* Telephone */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone size={20} className="text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1 pt-1">
                      <p className="text-sm text-gray-500 mb-1">Telepone</p>
                      <p className="font-semibold text-gray-900 text-lg">{order.customer.phone}</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} className="text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1 pt-1">
                      <p className="text-sm text-gray-500 mb-1">Alamat</p>
                      <p className="font-medium text-gray-900 text-base leading-relaxed">
                        {order.customer.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AdminLayout>
  )
}

export default PesananDetailPage