"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Plus, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ProductPopuler() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<number>(0);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [addingToCart, setAddingToCart] = useState<string | null>(null); // Track which product is being added
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [res1, res2] = await Promise.all([
          fetch("/api/products").then((res) => res.json()),
          fetch("/api/products/categories").then((res) => res.json()),
        ]);
        setProducts(res1);
        setCategories(res2);
      } catch (err) {
        setError("Failed to fetch products or categories");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product: any) => {
    // Cek apakah user sudah login
    if (!session) {
      setShowErrorModal(true);
      return;
    }

    // Set loading state untuk produk yang sedang ditambahkan
    setAddingToCart(product.id);

    try {
      const data = {
        productId: product.id,
        quantity: 1,
        unitPrice: product.price,
      };

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (response.ok) {
        setCartItems(cartItems + 1);
        console.log("Produk berhasil ditambahkan ke keranjang");
      } else {
        const result = await response.json();
        console.error("Gagal menambahkan ke keranjang:", result.error);
        
        if (response.status === 401) {
          setShowErrorModal(true);
        }
      }
    } catch (error) {
      console.error("Error terjadi:", error);
    } finally {
      // Reset loading state
      setAddingToCart(null);
    }
  };

  const handleLoginRedirect = () => {
    setShowErrorModal(false);
    router.push("/auth/signin");
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Login Diperlukan
              </h3>
              <button
                onClick={closeErrorModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Anda harus login terlebih dahulu untuk menambahkan produk ke keranjang.
            </p>
            <div className="flex gap-3">
              <button
                onClick={closeErrorModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleLoginRedirect}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Category filters */}
      <div className="flex flex-wrap justify-center lg:justify-start lg:ml-42 gap-2 sm:gap-2.5 lg:gap-2 mb-4 animate-fade-in-up animation-delay-500">
        {categories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.name)}
            className={`px-3.5 sm:px-5 lg:px-4 py-1.5 sm:py-2.5 lg:py-2 rounded-full font-medium text-sm sm:text-sm lg:text-[0.8rem] transition-all duration-300 animate-slide-in-category ${
              activeCategory === category
                ? "bg-green-500 text-white shadow-lg scale-105"
                : "bg-green-50 text-green-600 border border-green-300 hover:bg-green-100 hover:scale-105"
            }`}
            style={{ animationDelay: `${600 + index * 100}ms` }}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Popular products section */}
      <div className="text-left max-w-7xl lg:w-3xl mx-auto px-4">
        <h2 className="text-lg sm:text-xl lg:text-base font-semibold text-gray-700 mb-4 lg:ml-22 animate-fade-in-up animation-delay-800">
          Produk populer hari ini!
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 lg:p-2 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group animate-card-appear"
              style={{ animationDelay: `${900 + index * 200}ms` }}
            >
              {/* 1. Gambar */}
              <div className="mb-4 bg-gray-50 rounded-xl overflow-hidden transform transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={product.imageUrl[0] || "/placeholder.svg"}
                  alt={product.name}
                  width={400}
                  height={250}
                  className="w-full h-28 lg:h-24 object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* 2. Nama + Berat */}
              <h4 className="font-bold text-base sm:text-lg lg:text-sm text-gray-800 mb-1 group-hover:text-green-600 transition-colors duration-300">
                {product.name}{" "}
                <span className="font-normal text-gray-600">
                  {product.weight}
                </span>
              </h4>

              {/* 3. Stok */}
              <p className="text-gray-500 text-sm lg:text-xs mb-1">
                Sisa stok: {product.stock}
              </p>

              {/* 4. Deskripsi */}
              <p className="text-gray-600 text-xs sm:text-sm lg:text-[0.7rem] mb-1">
                {product.description}
              </p>

              {/* 5. Harga */}
              <span className="block text-base sm:text-xl lg:text-sm font-bold text-gray-800 mb-1.5">
                {product.price}
              </span>

              {/* 6. Button */}
              <button
                onClick={() => handleAddToCart(product)}
                disabled={addingToCart === product.id}
                className={`w-full px-3 py-2 lg:px-2.5 lg:py-2 rounded-lg font-medium text-sm lg:text-sm transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95 ${
                  addingToCart === product.id
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 text-white hover:shadow-lg hover:scale-105"
                }`}
              >
                {addingToCart === product.id ? (
                  <>
                    <Loader2 className="w-4 h-4 lg:w-4 lg:h-4 animate-spin" />
                    Menambahkan...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 lg:w-4 lg:h-4" />
                    Tambah ke Keranjang
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}