// components/Notifikasi.tsx
"use client";
import { useState } from "react";
import AdminLayout from "../AdminLayout";
import { Filter, ChevronDown, X } from "lucide-react";

interface Notification {
  id: string;
  waktu: string;
  isi: string;
  status: "Sedang proses" | "Dikirim" | "Pesanan selesai";
  penerima: {
    name: string;
    avatar: string;
  };
}

const Notifikasi = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [filterStatus, setFilterStatus] = useState("Semua");

  // Dummy data sesuai dengan gambar
  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      waktu: "Juli 14, 2025",
      isi: "Mohon tunggu pesanan anda #INV-0015 sedang kami proses.",
      status: "Sedang proses",
      penerima: {
        name: "Leasie Watson",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
    },
    {
      id: "2",
      waktu: "Juli 13, 2025",
      isi: "Mohon tunggu pesanan anda #INV-0015 sedang kami proses.",
      status: "Sedang proses",
      penerima: {
        name: "Theresa Webb",
        avatar: "https://i.pravatar.cc/150?img=2",
      },
    },
    {
      id: "3",
      waktu: "Juli 12, 2025",
      isi: "Mohon tunggu pesanan anda #INV-0015 telah diserahkan kepada kurir dan sedang menuju ke alamat tujuan.",
      status: "Dikirim",
      penerima: {
        name: "Darrell Steward",
        avatar: "https://i.pravatar.cc/150?img=3",
      },
    },
    {
      id: "4",
      waktu: "Juli 12, 2025",
      isi: "Periksa kelengkapan untuk pesanan #INV-0015. Puas dengan pesananmu? Jangan lupa untuk memberikan penilaian produk kami.",
      status: "Pesanan selesai",
      penerima: {
        name: "Ronald Richards",
        avatar: "https://i.pravatar.cc/150?img=4",
      },
    },
    {
      id: "5",
      waktu: "Juli 12, 2025",
      isi: "Periksa kelengkapan untuk pesanan #INV-0015. Puas dengan pesananmu? Jangan lupa untuk memberikan penilaian produk kami.",
      status: "Pesanan selesai",
      penerima: {
        name: "Darrius Poliusus",
        avatar: "https://i.pravatar.cc/150?img=5",
      },
    },
  ]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Sedang proses":
        return "bg-yellow-100 text-yellow-700";
      case "Dikirim":
        return "bg-orange-100 text-orange-700";
      case "Pesanan selesai":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filterStatus === "Semua") return true;
    return notif.status === filterStatus;
  });

  return (
    <AdminLayout>
      <main className="flex-1 bg-gray-50 pt-3">
        {/* Main Container with shadow and rounded corners */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header Section */}
          <div className="p-4 sm:pt-6 sm:pb-0 bg-white">
            <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
              {/* Header Text */}
              <div className="flex flex-col">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tabel notifikasi</h1>
                <p className="text-gray-500 text-sm sm:text-base mt-1">
                  Ini adalah daftar notifikasi ke customers
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                {/* Filter Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center gap-2 sm:gap-3 transition-colors text-sm w-full sm:w-auto"
                  >
                    <Filter className="text-green-600 w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Filter</span>
                    <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications Table */}
          <div className="p-4 sm:p-6">
            {/* Mobile Card View */}
            <div className="block lg:hidden space-y-4">
              {filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 whitespace-nowrap">{notif.waktu}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusBadgeClass(
                          notif.status
                        )}`}
                      >
                        {notif.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 line-clamp-2">{notif.isi}</p>
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <img
                        src={notif.penerima.avatar}
                        alt={notif.penerima.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-xs font-medium text-gray-900 whitespace-nowrap">
                        {notif.penerima.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {filteredNotifications.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg font-medium">Tidak ada notifikasi ditemukan</p>
                  <p className="text-sm mt-1">Coba ubah filter Anda</p>
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 uppercase text-xs tracking-wider whitespace-nowrap">
                      WAKTU
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                      ISI
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 uppercase text-xs tracking-wider whitespace-nowrap">
                      STATUS
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 uppercase text-xs tracking-wider whitespace-nowrap">
                      PENERIMA
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotifications.map((notif, index) => (
                    <tr
                      key={notif.id}
                      className={`hover:bg-gray-100 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="text-xs text-gray-900 whitespace-nowrap">{notif.waktu}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-700 text-xs line-clamp-1">{notif.isi}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap inline-block ${getStatusBadgeClass(
                            notif.status
                          )}`}
                        >
                          {notif.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={notif.penerima.avatar}
                            alt={notif.penerima.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-xs text-gray-900 whitespace-nowrap">{notif.penerima.name}</span>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredNotifications.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-12 px-6 text-center bg-white">
                        <div className="text-gray-500">
                          <p className="text-lg font-medium">Tidak ada notifikasi ditemukan</p>
                          <p className="text-sm mt-1">Coba ubah filter Anda</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Filter Dropdown */}
        {showFilter && (
          <div
            className="fixed inset-0 z-40 flex items-center justify-center"
            onClick={() => setShowFilter(false)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filter Notifikasi</h3>
                <button
                  onClick={() => setShowFilter(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none focus:border-transparent"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option>Semua</option>
                    <option>Sedang proses</option>
                    <option>Dikirim</option>
                    <option>Pesanan selesai</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    onClick={() => setShowFilter(false)}
                  >
                    Terapkan
                  </button>
                  <button
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    onClick={() => {
                      setFilterStatus("Semua");
                      setShowFilter(false);
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
  );
};

export default Notifikasi;