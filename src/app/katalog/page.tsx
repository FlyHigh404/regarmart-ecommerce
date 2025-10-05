"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import CartProduct from "@/components/CartProduct";
import KategoriSide from "@/components/KategoriSide";
import KategoriMobile from "@/components/KategoriMobile"; 
import Pagination from "@/components/Pagination";
import Footer from "@/components/Footer";
import NavSearch from "@/components/NavSearch";

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

        
        const filtered = selectedCategories.filter((c) => c !== "all");
        if (filtered.length > 0) {
          params.append("categoryId", filtered.join(",")); 
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
        <NavSearch />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-32 flex gap-6">
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
          {totalPages > 0 && (
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
