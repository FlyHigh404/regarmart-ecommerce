"use client"
import AdminLayout from "@/app/admin/AdminLayout";
import { useState } from "react"
import { Search, Bell } from "lucide-react";
import CardPenjualan from "../components/cards/CardPenjualan";
import CardPesanan from "../components/cards/CardPesanan";
import CardPengguna from "../components/cards/CardPengguna";
import Grafik from "@/app/admin/components/grafik/Grafik"
import ActivityLogCard from "@/app/admin/components/logAktivitas/LogAktivitas"

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AdminLayout>
      {/* HEADER BAR */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 p-3 sm:p-4 mb-4 sm:mb-6">
        {/* Search Bar */}
        <div className="relative w-full sm:w-2/3 lg:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Cari disini..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
          />
        </div>
        
        {/* Notifikasi dan Avatar */}
        <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bell size={20} className="text-gray-600 hover:text-green-500 cursor-pointer transition-colors sm:text-xl" />
              {/* Indikator notifikasi baru */}
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </div>
            <span className="text-sm sm:text-base font-medium text-gray-800 hidden sm:block">
              Hello, <span className="font-bold">Admin</span>
            </span>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold overflow-hidden">
            <img src="/icon.png" alt="Admin Avatar" className="w-full h-full rounded-full object-cover" />
          </div>
        </div>
      </div>
      
      {/* MAIN CONTENT CONTAINER */}
      <div className="space-y-4 sm:space-y-6">
        {/* CARD OVERVIEW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <CardPenjualan />
          <CardPesanan />
          <CardPengguna />
        </div>

        {/* GRAFIK OVERVIEW */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
          <Grafik />
        </div>

        {/* LOG AKTIVITAS */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
          <ActivityLogCard />
        </div>
      </div>
    </AdminLayout>
  );
}