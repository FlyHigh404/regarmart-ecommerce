"use client"
import { useState } from "react"
import AdminLayout from "../AdminLayout"
import { Search, Filter, ChevronDown, Eye } from "lucide-react"
import { useRouter } from "next/navigation"

const sampleOrders = [
  {
    id: "#INV-0015",
    customer: {
      name: "Leasie Watson",
      avatar: "/woman-profile.png",
    },
    status: "Menunggu",
    total: "Rp168.500",
    date: "Juli 14, 2025",
  },
  {
    id: "#INV-0013",
    customer: {
      name: "Theresa Webb",
      avatar: "/woman-profile-two.png",
    },
    status: "Sedang proses",
    total: "Rp67.800",
    date: "Juli 12, 2025",
  },
  {
    id: "#INV-0011",
    customer: {
      name: "Esther Howard",
      avatar: "/woman-profile.png",
    },
    status: "Dikirim",
    total: "Rp73.500",
    date: "Juli 12, 2025",
  },
  {
    id: "#INV-0009",
    customer: {
      name: "Ronald Richards",
      avatar: "/man-profile.png",
    },
    status: "Pesanan selesai",
    total: "Rp14.000",
    date: "Juli 11, 2025",
  },
]

const Pesanan = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilter, setShowFilter] = useState(false)
  const [orders, setOrders] = useState(sampleOrders)
  const [filterStatus, setFilterStatus] = useState("Semua")
  const router = useRouter()

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      Menunggu: "bg-gray-100 text-gray-800",
      "Sedang proses": "bg-yellow-100 text-yellow-800",
      Dikirim: "bg-orange-100 text-orange-800",
      "Pesanan selesai": "bg-green-100 text-green-800",
    }

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800"}`}
      >
        {status}
      </span>
    )
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === "Semua" ? true : order.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const handlePreviewOrder = (order: any) => {
    router.push(`/pesanan/${order.id}`)
  }

  return (
    <AdminLayout>
      <main className="flex-1 bg-gray-50 pt-3">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 sm:pt-6 sm:pb-0 bg-white">
            <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
              <div className="flex flex-col">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tabel pesanan</h1>
                <p className="text-gray-500 text-sm sm:text-base mt-1">Ini adalah daftar pesanan terbaru</p>
              </div>

              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                <div className="relative order-2 sm:order-2">
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center gap-2 sm:gap-3 transition-colors text-sm w-full sm:w-auto"
                  >
                    <Filter className="text-green-600 w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Filter</span>
                    <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="block lg:hidden space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <img
                          src={order.customer.avatar || "/placeholder.svg"}
                          alt={order.customer.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm">{order.id}</h3>
                          <p className="text-gray-600 text-xs">{order.customer.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        {getStatusBadge(order.status)}
                        <span className="text-sm font-medium text-gray-900">{order.total}</span>
                      </div>
                      <p className="text-gray-500 text-xs mt-1">{order.date}</p>
                    </div>
                    <div className="flex items-center ml-3">
                      <button
                        onClick={() => handlePreviewOrder(order)}
                        className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="View"
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredOrders.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg font-medium">Tidak ada pesanan ditemukan</p>
                  <p className="text-sm mt-1">Coba ubah kata kunci pencarian Anda</p>
                </div>
              )}
            </div>

            <div className="hidden lg:block overflow-x-auto rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                      ID
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                      PELANGGAN
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                      STATUS
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                      TOTAL
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                      TANGGAL
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                      TINDAKAN
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr
                      key={order.id}
                      className={`hover:bg-gray-100 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                    >
                      <td className="py-5 px-6">
                        <div className="font-medium text-gray-900 text-sm">{order.id}</div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={order.customer.avatar || "/placeholder.svg"}
                            alt={order.customer.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="text-gray-900 text-sm font-medium">{order.customer.name}</span>
                        </div>
                      </td>
                      <td className="py-5 px-6">{getStatusBadge(order.status)}</td>
                      <td className="py-5 px-6">
                        <span className="text-gray-900 text-sm font-medium">{order.total}</span>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-gray-600 text-sm">{order.date}</span>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-2 ml-3">
                          <button
                            onClick={() => handlePreviewOrder(order)}
                            className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 px-6 text-center bg-white">
                        <div className="text-gray-500">
                          <p className="text-lg font-medium">Tidak ada pesanan ditemukan</p>
                          <p className="text-sm mt-1">Coba ubah kata kunci pencarian Anda</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {showFilter && (
          <div className="fixed inset-0 z-40" onClick={() => setShowFilter(false)}>
            <div
              className="absolute top-32 right-4 sm:right-8 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-64 max-w-[calc(100vw-2rem)]"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-medium text-gray-900 mb-3">Filter Pesanan</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none focus:border-transparent"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option>Semua</option>
                    <option>Menunggu</option>
                    <option>Sedang proses</option>
                    <option>Dikirim</option>
                    <option>Pesanan selesai</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    onClick={() => setShowFilter(false)}
                  >
                    Terapkan
                  </button>
                  <button
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    onClick={() => {
                      setFilterStatus("Semua")
                      setShowFilter(false)
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </AdminLayout>
  )
}

export default Pesanan
