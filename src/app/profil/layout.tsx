"use client"

import { useRouter } from "next/navigation"
import { CircleChevronLeft } from "lucide-react"
import ProfilNavbar from "@/components/NavProfil"
import Sidebar from "@/components/ProfilSide"
import Footer from "@/components/Footer"
import AuthCheck from "@/components/AuthCheck"


export default function ProfilLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <AuthCheck role="CUSTOMER">
    <div className="min-w-screen min-h-screen mx-auto font-jakarta bg-gray-100 flex flex-col">
      {/* Navbar */}
      <ProfilNavbar />

      {/* Tombol kembali */}
      <div className="px-10 mt-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-green-500 hover:text-green-700 font-medium"
        >
          <CircleChevronLeft size={28} />
          <span>Kembali</span>
        </button>
      </div>

      {/* Wrapper untuk konten */}
      <div className="mt-6 px-10 pb-20 ">
        <div className="flex gap-12">
          {/* Sidebar kiri */}
          <Sidebar />

          {/* Halaman utama */}
          <div className="flex-1">{children}</div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
    </AuthCheck>
  )
}
