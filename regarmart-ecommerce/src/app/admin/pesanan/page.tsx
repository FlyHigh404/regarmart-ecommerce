"use client"
import { useState, useEffect } from "react"
import AdminLayout from "../AdminLayout"
import { Search, Filter, ChevronDown, Eye, Calendar, DollarSign, User, Package } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Pesanan() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilter, setShowFilter] = useState(false)
  const [orders, setOrders] = useState<any[]>([])
  const [filterStatus, setFilterStatus] = useState("Semua")
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const statusMap: Record<string, string> = {
    PENDING: "Menunggu",
    PROCESSING: "Sedang proses",
    SHIPPED: "Dikirim",
    COMPLETED: "Pesanan selesai",
    CANCELED: "Dibatalkan",
  }

  const statusBadgeStyle: Record<string, string> = {
    Menunggu: "bg-gray-100 text-gray-800",
    "Sedang proses": "bg-yellow-100 text-yellow-800",
    Dikirim: "bg-orange-100 text-orange-800",
    "Pesanan selesai": "bg-green-100 text-green-800",
    Dibatalkan: "bg-red-100 text-red-800",
  }

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount
    return numAmount.toLocaleString("id-ID", { style: "currency", currency: "IDR" })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/admin/order")
        if (!res.ok) throw new Error("Gagal fetch data")
        const data = await res.json()

        const mapped = data.map((order: any) => ({
          id: order.id,
          customer: {
            name: order.user?.name || "Tanpa Nama",
            avatar: order.user?.image || "/placeholder.svg",
          },
          status: statusMap[order.status] || order.status,
          total: formatCurrency(order.totalAmount),
          date: formatDate(order.createdAt),
        }))

        setOrders(mapped)
      } catch (error) {
        console.error("Gagal mengambil data pesanan:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === "Semua" ? true : order.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (status: string) => (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadgeStyle[status] || "bg-gray-100 text-gray-800"
        }`}
    >
      {status}
    </span>
  )

  const handlePreviewOrder = (order: any) => {
    router.push(`/admin/pesanan/${order.id}`)
  }

  if (loading) {
    return (
      <AdminLayout>
        <main className="flex-1 bg-gray-50 pt-3">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden p-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-600">Loading pesanan...</p>
            </div>
          </div>
        </main>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <main className="flex-1 bg-gray-50 pt-3">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:pt-6 sm:pb-0 bg-white">
            <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
              <div className="flex flex-col">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tabel pesanan</h1>
                <p className="text-gray-500 text-sm sm:text-base mt-1">Ini adalah daftar pesanan terbaru</p>
              </div>
            </div>

            {/* Mobile Search & Filter - Only show on mobile */}
            <div className="mt-4 lg:hidden">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Cari pesanan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:outline-none focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${filterStatus !== "Semua"
                      ? "bg-green-600 text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <Filter size={18} />
                  {filterStatus !== "Semua" && (
                    <span className="bg-white text-green-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Tabel & Card */}
          <div className="p-4 sm:p-6">
            {/* Improved Mobile card view */}
            <div className="block lg:hidden space-y-3">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => handlePreviewOrder(order)}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 active:scale-[0.98] cursor-pointer"
                >
                  {/* Header with Avatar and Status */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="relative">
                        <img
                          src={order.customer.avatar}
                          alt={order.customer.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">{order.customer.name}</h3>
                      </div>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 my-3"></div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-17">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="text-sm font-semibold text-gray-900">{order.total}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-xs text-gray-500">Tanggal</p>
                        <p className="text-sm font-medium text-gray-900">{order.date.split(' ').slice(0, 2).join(' ')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-center gap-50 text-sm">
                      <span className="text-gray-500">Lihat Detail</span>
                      <Eye size={16} className="text-blue-600" />
                    </div>
                  </div>
                </div>
              ))}

              {filteredOrders.length === 0 && (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package size={32} className="text-gray-400" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900">Tidak ada pesanan ditemukan</p>
                  <p className="text-sm text-gray-500 mt-2">Coba ubah kata kunci pencarian Anda</p>
                </div>
              )}
            </div>

            {/* Desktop table - unchanged */}
            <div className="hidden lg:block overflow-x-auto rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
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
                      className={`hover:bg-gray-100 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                    >
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={order.customer.avatar}
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
                      <td colSpan={5} className="py-12 px-6 text-center bg-white">
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

        {/* Improved Modal Filter */}
        {showFilter && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setShowFilter(false)}
            ></div>

            {/* Modal - Slide from bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transform transition-transform"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
              </div>

              <div className="p-6 pb-8">
                <h3 className="font-bold text-xl text-gray-900 mb-6">Filter Pesanan</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Status Pesanan</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Semua", "Menunggu", "Sedang proses", "Dikirim", "Pesanan selesai", "Dibatalkan"].map(
                        (status) => (
                          <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${filterStatus === status
                                ? "bg-green-600 text-white shadow-md scale-105"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                          >
                            {status}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      className="flex-1 bg-green-600 text-white py-3.5 px-4 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors shadow-md active:scale-95"
                      onClick={() => setShowFilter(false)}
                    >
                      Terapkan Filter
                    </button>
                    <button
                      className="flex-1 bg-gray-100 text-gray-700 py-3.5 px-4 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors active:scale-95"
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
          </div>
        )}
      </main>
    </AdminLayout>
  )
}