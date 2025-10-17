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