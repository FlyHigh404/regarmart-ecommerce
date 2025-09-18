"use client"
import { useState } from "react"
import { ArrowLeft, ChevronDown, Phone, MapPin, Check } from "lucide-react"
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
    timeline: [
      { status: "Pesanan telah tiba dan diterima pembeli", time: "09:25 WIB", completed: true },
      { status: "Pesanan dikirim oleh kurir", time: "09:15 WIB", completed: true },
      { status: "Pesanan diproses", time: "09:08 WIB", completed: true },
      { status: "Menunggu pesanan disiapkan", time: "08:55 WIB", completed: true },
    ],
    date: "14-07-2025 | 08:55",
  },
}

const PesananDetailPage = () => {
  const router = useRouter()
  const [selectedStatus, setSelectedStatus] = useState("Dikirim")

  // Langsung ambil order pertama untuk preview
  const order = orderData["#INV-0015"]

  return (
    <AdminLayout>
      <main className="flex-1 bg-gray-50 pt-4 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => router.back()} className="w-10 h-10 border-2 border-green-500 rounded-full flex items-center justify-center hover:bg-green-50 transition-colors">
              <ArrowLeft size={18} className="text-green-500" />
            </button>
            <h1 className="text-lg font-medium text-green-600">Kembali</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Pesanan (3)</h2>
                <h3 className="text-base font-semibold text-gray-900 mb-4">No Pesanan : {order.id}</h3>

                {/* Order Items */}
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-4 py-4 border-b border-gray-100 last:border-b-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-base mb-2 leading-snug">{item.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">ID : {item.id}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900">{item.price}</span>
                          <span className="text-sm text-gray-500">Qty : x{item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Detail pembayaran</h2>
                <p className="text-sm text-gray-500 mb-6">{order.date}</p>

                <div className="space-y-4">
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
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total pembayaran</span>
                      <span className="text-lg font-semibold text-gray-900">{order.payment.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Status & Customer */}
            <div className="space-y-6">
              {/* Delivery Status */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="bg-orange-400 text-white text-center py-4 px-4 rounded-lg mb-6">
                  <div className="font-semibold text-base">DIKIRIM KURIR</div>
                  <div className="text-sm mt-1">Estimasi Tiba 8 - 10 Menit</div>
                </div>

                {/* Timeline */}
                <div className="space-y-4 mb-6">
                  {order.timeline.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            item.completed ? "bg-green-500" : "bg-gray-300"
                          }`}
                        >
                          {item.completed && <Check size={12} className="text-white" />}
                        </div>
                        {index < order.timeline.length - 1 && (
                          <div className="w-0.5 h-6 bg-gray-200 mt-2 flex-shrink-0"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 leading-tight">{item.status}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status Dropdown */}
                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none focus:border-transparent appearance-none bg-white pr-10"
                  >
                    <option value="Status">Status</option>
                    <option value="Menunggu">Menunggu</option>
                    <option value="Sedang proses">Sedang proses</option>
                    <option value="Dikirim">Dikirim</option>
                    <option value="Pesanan selesai">Pesanan selesai</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={order.customer.avatar || "/placeholder.svg"}
                    alt={order.customer.name}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-base">{order.customer.name}</h3>
                    <p className="text-sm text-gray-600">Pelanggan</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border border-green-200 rounded-lg bg-green-50/30">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone size={16} className="text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-600 mb-1">Telephone</p>
                      <p className="font-medium text-gray-900 text-sm">{order.customer.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border border-green-200 rounded-lg bg-green-50/30">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin size={16} className="text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-600 mb-1">Alamat</p>
                      <p className="font-medium text-gray-900 text-xs leading-relaxed">{order.customer.address}</p>
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