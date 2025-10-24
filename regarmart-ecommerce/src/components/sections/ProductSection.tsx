"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Plus, X, Loader2, CheckCircle, AlertCircle, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

// ✅ Toast Notification
const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => (
  <div className="fixed top-26 right-4 z-[100] animate-slide-in">
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
        type === "success"
          ? "bg-green-50 border border-green-200"
          : "bg-red-50 border border-red-200"
      }`}
    >
      {type === "success" ? (
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
      )}
      <p
        className={`text-sm font-medium ${
          type === "success" ? "text-green-800" : "text-red-800"
        }`}
      >
        {message}
      </p>
      <button
        onClick={onClose}
        className={`ml-2 ${
          type === "success"
            ? "text-green-600 hover:text-green-700"
            : "text-red-600 hover:text-red-700"
        }`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// ✅ Modal Login
const LoginModal = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-transparent backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-[#26A81D] rounded-full flex items-center justify-center">
            <LogIn size={32} className="text-white" />
          </div>
        </div>
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Login Diperlukan</h3>
          <p className="text-gray-600 leading-relaxed">
            Anda harus login terlebih dahulu untuk menambahkan produk ke keranjang.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-[#26A81D] hover:bg-green-600 text-white font-semibold rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <LogIn size={18} />
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ Skeleton Loader
const ProductSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-white rounded-lg sm:rounded-xl p-1.5 sm:p-3 lg:p-2 shadow-sm">
        <div className="mb-2 sm:mb-4 bg-gray-200 rounded-lg h-20 sm:h-28 lg:h-24 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2 animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-full mb-2 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3 animate-pulse" />
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
      </div>
    ))}
  </div>
);

export default function ProductPopuler() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();
  const { incrementCart } = useCart();

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productRes, categoryRes] = await Promise.all([
          fetch("/api/products").then((r) => r.json()),
          fetch("/api/products/categories").then((r) => r.json()),
        ]);
        setProducts(productRes);
        setCategories(categoryRes);
      } catch (err) {
        setError("Gagal memuat produk atau kategori");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // ✅ Format harga
  const formatPrice = (price: number) => `Rp ${price.toLocaleString("id-ID")}`;

  const handleAddToCart = async (product: any) => {
    if (!session) {
      setPendingProduct(product);
      setShowLoginModal(true);
      return;
    }
    if (session.user?.role === "ADMIN") {
      setToast({
        message: "Akun admin tidak dapat menambahkan produk ke keranjang.",
        type: "error",
      });
      return;
    }
    await addToCart(product);
  };

  const addToCart = async (product: any) => {
    setAddingToCart(product.id);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1, unitPrice: product.price }),
        credentials: "include",
      });

      if (res.ok) {
        incrementCart();
        setToast({
          message: `${product.name} berhasil ditambahkan ke keranjang!`,
          type: "success",
        });
      } else {
        const result = await res.json();
        setToast({ message: result.error || "Gagal menambahkan ke keranjang.", type: "error" });
      }
    } catch {
      setToast({ message: "Terjadi kesalahan saat menambahkan ke keranjang.", type: "error" });
    } finally {
      setAddingToCart(null);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = !activeCategory || product.category?.name === activeCategory;
    return matchSearch && matchCategory;
  });

  if (loading) return <ProductSkeleton />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onConfirm={() => router.push("/auth/signin")}
      />

      {/* 🔍 Search */}
      <div className="relative max-w-xl mx-auto mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Cari produk..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-3xl shadow bg-white"
        />
      </div>

      {/* 🏷️ Kategori */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-2 rounded-full text-sm ${
            activeCategory === null ? "bg-green-500 text-white" : "bg-green-50 text-green-600"
          }`}
        >
          Semua
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.name)}
            className={`px-4 py-2 rounded-full text-sm ${
              activeCategory === c.name ? "bg-green-500 text-white" : "bg-green-50 text-green-600"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* 🛍️ Produk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((product, index) => (
          <Link href={`/katalog/${product.id}`} key={product.id}>
            <div
              className="bg-white p-2 rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Image
                src={product.imageUrl[0] || "/placeholder.svg"}
                alt={product.name}
                width={400}
                height={250}
                className="w-full h-28 object-cover rounded-md mb-2"
              />
              <h4 className="font-bold text-sm text-gray-800">{product.name}</h4>
              <p className="text-xs text-gray-500 mb-1">Stok: {product.stock}</p>
              <p className="text-xs text-gray-600 line-clamp-2 mb-1">{product.description}</p>
              <span className="block text-sm font-bold mb-2">{formatPrice(product.price)}</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
                disabled={addingToCart === product.id || product.stock === 0}
                className={`w-full py-2 rounded-lg text-sm flex items-center justify-center gap-1
                  ${
                    product.stock === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
              >
                {addingToCart === product.id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Menambahkan...
                  </>
                ) : product.stock === 0 ? (
                  "Stok Habis"
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Tambah Keranjang
                  </>
                )}
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}