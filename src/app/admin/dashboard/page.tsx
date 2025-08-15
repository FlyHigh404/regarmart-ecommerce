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
      <div className="flex items-center justify-between p-4 mb-6">
        {/* Search Bar */}
        <div className="relative w-2/3">
          <Search className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Cari disini..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
          />
        </div>
        
        {/* Notifikasi dan Avatar */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell size={24} className="text-gray-600 hover:text-green-500 cursor-pointer" />
            {/* Indikator notifikasi baru */}
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </div>
          <span className="text-base font-medium text-gray-800 hidden md:block">
           Hello, <span className="font-bold">Admin</span></span>
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold overflow-hidden">
            <img src="/icon.png" alt="Admin Avatar" className="rounded-full object-cover" />
          </div>
        </div>
      </div>
      
      {/* CARD OVERVIEW */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
          <CardPenjualan />
          <CardPesanan />
          <CardPengguna />
        </div>
      </div>

      {/* GRAFIK OVERVIEW */}
      <div className="space-y-6">
        <div className="bg-white rounded-b-md">
          <Grafik />
        </div>
      </div>

       {/* Log Aktivitas */}
      <div className="space-y-6">
        <div className="bg-white rounded-b-md">
          <ActivityLogCard />
        </div>
      </div>
    </AdminLayout>
  );
}
