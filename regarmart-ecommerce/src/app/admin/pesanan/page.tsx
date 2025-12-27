"use client"
import { useState, useEffect } from "react"
import AdminLayout from "../AdminLayout"
import { Eye, Package, Plus, Car, Users, Edit, Trash } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Pesanan() {
  const [searchTerm, setSearchTerm] = useState("")
  const [orders, setOrders] = useState<any[]>([])
  const [filterStatus, setFilterStatus] = useState("Semua")
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  // kurir manajemen
  const [showManageCourier, setshowManageCourier] = useState(false);
  const [couriers, setCouriers] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [selectedCourierId, setSelectedCourierId] = useState<string>("")
  const [assignLoading, setAssignLoading] = useState(false)

  // counter avaiable courier
  const availableCourierCount = couriers.filter(c => c.status === "AVAILABLE").length;

  const statusMap: Record<string, string> = {
    PENDING: "Menunggu", 
    PROCESSING: "Sedang proses", // assign kurir in this state
    SHIPPED: "Dikirim", //kurir unvailable
    COMPLETED: "Pesanan selesai", //kurir available
    CANCELED: "Dibatalkan", //kurir avaiable
  }

  const courirerStatus: Record<string, string> = {
    AVAILABLE: "Tersedia", 
    ON_DELIVERY: "Sedang mangantar", 
    INACTIVE: "Tidak Tersedia", 
  }

  const statusBadgeStyle: Record<string, string> = {
    Menunggu: "bg-gray-100 text-gray-800",
    "Sedang proses": "bg-yellow-100 text-yellow-800",
    Dikirim: "bg-orange-100 text-orange-800",
    "Pesanan selesai": "bg-green-100 text-green-800",
    Dibatalkan: "bg-red-100 text-red-800",
  }

  const courierStatusBadgeStyle: Record<string, string> = {
    Tersedia: "bg-green-100 text-green-800",
    Mengirim: "bg-orange-100 text-orange-800",
    "Tidak Tersedia": "bg-red-100 text-red-800",
  }

  const handleAssignCourier = async () => {
    if (!selectedOrder || !selectedCourierId) return;
    setAssignLoading(true);
  
    try {
      const res = await fetch("/api/admin/courier/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          courierId: selectedCourierId,
        }),
      });
  
      if (res.ok) {
        const refreshOrders = await fetch("/api/admin/order");
        const orderData = await refreshOrders.json();
        setOrders(orderData.map((order: any) => ({
            id: order.id,
            customer: {
              name: order.user?.name || "Tanpa Nama",
              avatar: order.user?.image || "/placeholder.svg",
            },
            status: statusMap[order.status] || order.status,
            total: formatCurrency(order.totalAmount),
            date: formatDate(order.createdAt),
        })));
        
        fetchCouriers();
        setshowManageCourier(false);
        setSelectedOrder(null);
      }
    } catch (err) {
      alert("Failed to assign courier");
    } finally {
      setAssignLoading(false);
    }
  };

  // Add new courier (opens prompt or inline form)
  const handleAddCourier = async () => {
    const name = prompt("Masukkan nama kurir:");
    if (!name) return;
  
    try {
      const res = await fetch("/api/admin/courier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
  
      if (res.ok) {
        await fetchCouriers();  // Refresh list from DB
      }
    } catch (err) {
      alert("Gagal menambah kurir");
    }
  };

  // Edit courier name/status
  const handleEditCourier = (courier: any) => {
    const newName = prompt("Edit courier name:", courier.name);
    if (newName === null) return;

    const newStatus = prompt("Edit courier status (AVAILABLE / ON_DELIVERY / INACTIVE):", courier.status);
    if (!newStatus) return;

    setCouriers(prev => prev.map(c =>
      c.id === courier.id ? { ...c, name: newName, status: newStatus } : c
    ));
  };

  // Delete courier
  const handleDeleteCourier = async (id: string) => {
    // 1. Confirm with the user
    if (!confirm(`Apakah Anda yakin ingin menghapus Kurir ${id}?`)) return;
  
    try {
      // 2. Call the API
      const res = await fetch(`/api/admin/courier/${id}`, {
        method: "DELETE",
      });
  
      const data = await res.json();
  
      if (res.ok) {
        // 3. Refresh the data from the database so the UI updates
        alert("Kurir berhasil dihapus");
        fetchCouriers(); 
      } else {
        // Show the error message from the backend (e.g., if courier is busy)
        alert(data.error || "Gagal menghapus kurir");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Terjadi kesalahan koneksi");
    }
  };

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
          courierName: order.courier?.name || null,
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


  useEffect(() => {
    fetchCouriers();
  }, []);
  
  const fetchCouriers = async () => {
    try {
      const res = await fetch("/api/admin/courier"); // You'll need this route
      if (res.ok) {
        const data = await res.json();
        setCouriers(data);
      }
    } catch (err) {
      console.error("Gagal mengambil data kurir", err);
    }
  };

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
              
              <div className="flex gap-1 align-middle items-center justify-center">
                {/* Available counter */}
                <span className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm font-medium ${
                  availableCourierCount > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {availableCourierCount > 0
                    ? `${availableCourierCount} Tersedia`
                    : "Kurir Tidak Tersedia"}
                </span>

                {/* Courrier Management */}
                <button
                  onClick={() => setshowManageCourier(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center gap-2 sm:gap-3 transition-colors font-medium text-sm flex-1 sm:flex-none"
                >
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Manajemen Kurir</span>
                  <span className="sm:hidden">Kurir</span>
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
                      {/* Preview Button */}
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
                          <button onClick={() => handlePreviewOrder(order)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
                            <Eye size={16} />
                          </button>

                          {order.status === "Sedang proses" ? (
                            <button
                              onClick={() => {
                                setSelectedOrder(order); // Store the order context
                                setshowManageCourier(true);
                              }}
                              className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                            >
                              <Car size={14} /> Kirim
                            </button>
                          ) : order.status === "Dikirim" ? (
                            <div className="flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1.5 rounded-lg text-xs font-bold border border-orange-100">
                              DIKIRIM {order.courierName ? `Oleh ${order.courierName}` : ""}
                            </div>
                          ) : null}
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

        {/* Courir Modal */}
        {showManageCourier && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setshowManageCourier(false)}
            />

            {/* Modal */}
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
              <div className="sticky top-0 bg-white z-20 border-b border-gray-200 px-4 sm:px-6 py-4 rounded-t-xl">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">
                  Manajemen Kurir
                </h2>
                <button
                  onClick={() => setshowManageCourier(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">Daftar Kurir</h3>
                  <button
                    onClick={() => handleAddCourier()}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Tambah Kurir
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-2 px-3">ID</th>
                        <th className="py-2 px-3">Nama</th>
                        <th className="py-2 px-3">Status</th>
                        <th className="py-2 px-3">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {couriers.map((c) => (
                        <tr key={c.id} className="border-b">
                          <td className="py-2 px-3">{c.id}</td>
                          <td className="py-2 px-3">{c.name}</td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              courierStatusBadgeStyle[courirerStatus[c.status]] || "bg-gray-100 text-gray-800"
                            }`}>
                              {courirerStatus[c.status] || c.status}
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-3 justify-end">
                              {/* Management Actions: Only show if NOT assigning to an order */}
                              {!selectedOrder && (
                                <>
                                  <button onClick={() => handleEditCourier(c)} className="text-gray-600 hover:text-blue-600 transition-colors">
                                    <Edit size={14} />
                                  </button>
                                  <button onClick={() => handleDeleteCourier(c.id)} className="text-gray-600 hover:text-red-600 transition-colors">
                                    <Trash size={14} />
                                  </button>
                                </>
                              )}

                              {/* Assignment Action: Only show if an order is selected */}
                              {selectedOrder && (
                                <button
                                  onClick={() => {
                                    setSelectedCourierId(c.id);
                                    handleAssignCourier();
                                  }}
                                  disabled={c.status !== "AVAILABLE" || assignLoading}
                                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                                    c.status === "AVAILABLE"
                                      ? "bg-green-600 text-white hover:bg-green-700"
                                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  }`}
                                >
                                  {assignLoading && selectedCourierId === c.id ? "..." : "PILIH KURIR"}
                                </button>
                              )}
                            </div>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </AdminLayout>
  )
}