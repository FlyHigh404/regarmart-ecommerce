"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CircleChevronLeft, Menu, X } from "lucide-react"
import ProfilNavbar from "@/components/NavProfil"
import Sidebar from "@/components/ProfilSide"
import Footer from "@/components/Footer"
import AuthCheck from "@/components/AuthCheck"

export default function ProfilLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <AuthCheck role="CUSTOMER">
      <div className="min-w-screen min-h-screen mx-auto font-jakarta bg-gray-100 flex flex-col">
        {/* Navbar */}
        <ProfilNavbar />

        {/* Tombol kembali */}
        <div className="px-4 md:px-10 mt-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-green-500 hover:text-green-700 font-medium"
            >
              <CircleChevronLeft size={28} />
              <span>Kembali</span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-green-500 hover:text-green-700"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
            <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg">
              <div className="flex justify-between items-center p-4 border-b">
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4">
                <Sidebar onItemClick={() => setIsMobileMenuOpen(false)} />
              </div>
            </div>
          </div>
        )}

        {/* Wrapper untuk konten */}
        <div className="mt-6 px-4 md:px-10 pb-20">
          <div className="flex flex-col md:flex-row gap-6 md:gap-12">
            <div className="hidden md:block">
              <Sidebar />
            </div>

            {/* Halaman utama */}
            <div className="flex-1 w-full">{children}</div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </AuthCheck>
  )
}
