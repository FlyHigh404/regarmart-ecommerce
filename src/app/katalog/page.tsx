"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import CartProduct from "@/components/CartProduct";
import KategoriSide from "@/components/KategoriSide";
import KategoriMobile from "@/components/KategoriMobile"; // ⬅️ import
import Pagination from "@/components/Pagination";
import Footer from "@/components/Footer";

export default function KatalogPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["all"]); // multi
  const [scrolled, setScrolled] = useState(false);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [totalPages, setTotalPages] = useState(1);

  // mobile filter modal
  const [showFilter, setShowFilter] = useState(false);

  // fetch kategori
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/products/categories");
        const data = await res.json();
        setCategories([{ id: "all", name: "Semua" }, ...data]);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // fetch produk
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append("q", searchTerm);

        // kalau pilih selain "all", kirim ke API (support multi category)
        const filtered = selectedCategories.filter((c) => c !== "all");
        if (filtered.length > 0) {
          params.append("categoryId", filtered.join(",")); // backend harus support multiple id
        }

        params.append("page", currentPage.toString());
        params.append("limit", itemsPerPage.toString());

        const res = await fetch(`/api/products/search?${params.toString()}`);
        const data = await res.json();

        setProducts(data.data || []);
        setTotalPages(data.meta?.totalPages || 1);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, [searchTerm, selectedCategories, currentPage]);

  // efek scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div
        className={`fixed top-0 w-full z-50 transition-all ${
          scrolled
            ? "bg-white backdrop-blur-sm shadow-sm"
            : "bg-transparent"
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
              onChange={(e) => {
                setCurrentPage(1);
                setSearchTerm(e.target.value);
              }}
              className="flex-1 px-3 py-2 rounded-full outline-none text-gray-700"
            />
          </div>

          {/* Desktop Category Filter */}
          <div className="hidden md:flex flex-wrap justify-center gap-3 mt-6">
            {categories.map((cat: any) => {
              const active =
                selectedCategories.includes(cat.id) ||
                (selectedCategories.includes("all") && cat.id === "all");
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCurrentPage(1);
                    setSelectedCategories([cat.id === "all" ? "all" : cat.id]);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    active
                      ? "bg-green-500 text-white shadow-lg scale-105"
                      : "bg-green-50 text-green-600 border border-green-300 hover:bg-green-100 hover:scale-105"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Mobile Filter Button */}
          <div className="flex md:hidden justify-center mt-4">
            <button
              onClick={() => setShowFilter(true)}
              className="px-6 py-2 bg-green-500 text-white rounded-full shadow hover:bg-green-600"
            >
              Filter
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 flex gap-6">
        {/* Sidebar Kategori (Desktop only) */}
        <div className="w-64 shrink-0 hidden md:block">
          <KategoriSide
            categories={categories}
            onSelectCategory={(catId) => {
              setSelectedCategories([catId]);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Produk */}
        <main className="flex-1">
          {products.length === 0 ? (
            <p className="text-center text-gray-500">
              Produk tidak ditemukan 😢
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
              {products.map((product, i) => (
                <CartProduct
                  key={product.id}
                  product={product}
                  index={i}
                />
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

      {/* Mobile Filter Modal */}
      {showFilter && (
        <KategoriMobile
          categories={categories}
          selectedCategories={selectedCategories}
          onClose={() => setShowFilter(false)}
          onChangeCategories={(selected) => setSelectedCategories(selected)}
          onReset={() => setSelectedCategories(["all"])}
        />
      )}
    </div>
  );
}
