"use client";

import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useState } from "react";

export default function KatalogPage() {
const [searchQuery, setSearchQuery] = useState("")
  return (
    <>
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar />

        {/* Hero and Search Section */}
        <div
          className="bg-green-500 bg-opacity-70 text-white py-12 px-8"
          style={{
            backgroundImage:
              "url('https://placehold.co/1200x400/519e42/white?text=background-image')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="max-w-7xl mx-auto">
              {/* Search Bar */}
                    <div className="relative max-w-xl mx-auto mb-5 px-2 sm:px-0 animate-fade-in-up animation-delay-400">
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 sm:w-4.5 lg:w-4 h-4 sm:h-4.5 lg:h-4 text-gray-900 animate-pulse-soft" />
                            <input
                                type="text"
                                placeholder="Cari produk terbaik di RegarMart..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 lg:py-2.5 text-sm sm:text-base lg:text-[0.95rem] border border-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-md bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-lg focus:scale-[1.01]"
                            />
                        </div>
                    </div>

            {/* Category Buttons */}
            <div className="flex flex-wrap justify-center space-x-2 md:space-x-4">
              <button className="px-4 py-2 rounded-full bg-white text-green-600 font-medium hover:bg-green-50 transition-colors">
                Semua
              </button>
              <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors">
                Sayur
              </button>
              <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors">
                Buah
              </button>
              <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors">
                Daging
              </button>
              <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors">
                Ikan
              </button>
              <button className="px-4 py-2 rounded-full bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors">
                Rumah Tangga
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid Section */}
        <section id="kategori" className="max-w-7xl mx-auto px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Produk Terbaru
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
