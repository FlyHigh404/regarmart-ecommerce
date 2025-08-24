"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import CartProduct from "@/components/CartProduct";
import KategoriSide from "@/components/KategoriSide";
import Pagination from "@/components/Pagination";
import Footer from "@/components/Footer";

 const products = Array.from({ length: 200 }, (_, i) => ({
    id: (i + 1).toString(),
    name: `Produk ${i + 1}`,
    category: i % 2 === 0 ? "Sayur" : "Buah",
    weight: `${(i % 5 + 1) * 250} gr`,
    stock: Math.floor(Math.random() * 20) + 1,
    description: `Deskripsi untuk produk ${i + 1}`,
    price: `Rp ${(Math.floor(Math.random() * 10) + 5) * 1000}`,
    image: "/susu.png",
  }))


const categories = ["Semua", "Sayur", "Buah", "Daging", "Ikan", "Rumah Tangga"];

export default function KatalogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [scrolled, setScrolled] = useState(false);

  //state pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; 

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // total halaman
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Ambil produk sesuai halaman
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div
        className={`fixed top-0 w-full z-50 transition-all ${
          scrolled ? "bg-white backdrop-blur-sm shadow-sm" : "bg-transparent"
        }`}
      >
        <Navbar />
      </div>

      {/* Search Section */}
      <section
        className="relative w-full h-96 flex flex-col items-center justify-center text-white pt-20"
        style={{
          backgroundImage: "url('/katalogbg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-3xl w-full px-6">
          {/* Search Bar */}
          <div className="bg-white flex items-center rounded-full shadow-md px-4 py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            <input
              type="text"
              placeholder="Cari produk terbaik di RegalMart..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 rounded-full outline-none text-gray-700"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedCategory === cat
                    ? "bg-green-500 text-white shadow-lg scale-105"
                    : "bg-green-50 text-green-600 border border-green-300 hover:bg-green-100 hover:scale-105"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 flex gap-6">
        {/* Sidebar Kategori */}
        <div className="w-64 shrink-0">
          <KategoriSide onSelectCategory={(cat) => setSelectedCategory(cat)} />
        </div>

        {/* Product Grid */}
        <main className="flex-1">
          {currentProducts.length === 0 ? (
            <p className="text-center text-gray-500">Produk tidak ditemukan 😢</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {currentProducts.map((product, i) => (
                <CartProduct key={product.id} product={product} index={i} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </main>
      </div>

        {/* Footer */}
         <Footer />
    </div>
  );
}
