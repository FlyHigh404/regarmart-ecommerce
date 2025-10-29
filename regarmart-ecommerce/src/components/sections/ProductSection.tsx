"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Plus, X, Loader2, CheckCircle, AlertCircle, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { useCart } from "@/context/CartContext";

// ---------------- Interfaces ----------------
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  weight: string;
  categoryName: string;
  imageUrl: string[];
}

// ---------------- Toast ----------------
const Toast = ({
  message,
  type,
  onClose
}: {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}) => (
  <div className="fixed top-26 right-4 z-[100] animate-slide-in">
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
      )}
      <p className={`text-sm font-medium ${type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
        {message}
      </p>
      <button onClick={onClose} className={`ml-2 ${type === 'success' ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'}`}>
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// ---------------- Login Modal ----------------
const LoginModal = ({
  isOpen,
  onClose,
  onConfirm
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
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
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
          <button onClick={onClose} className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
            Batal
          </button>
          <button onClick={onConfirm} className="flex-1 px-4 py-3 bg-[#26A81D] hover:bg-green-600 text-white font-semibold rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2">
            <LogIn size={18} />
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------- Product Skeleton ----------------
const ProductSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {[1,2,3,4,5,6].map(i => (
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

// ---------------- Main Component ----------------
export default function ProductPopuler() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();
  const { incrementCart } = useCart();

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [res1, res2] = await Promise.all([
          fetch("/api/products").then(res => res.json()),
          fetch("/api/products/categories").then(res => res.json()),
        ]);
        setProducts(res1);
        setCategories(res2);
      } catch (err) {
        setError("Gagal memuat produk atau kategori");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const formatPrice = (price: number) => `Rp ${price.toLocaleString('id-ID')}`;

  const handleAddToCart = async (product: Product) => {
    if (!session) {
      setPendingProduct(product);
      setShowLoginModal(true);
      return;
    }

    if (session.user?.role === "ADMIN") {
      setToast({ message: "Akun admin tidak dapat menambahkan produk ke keranjang.", type: 'error' });
      return;
    }

    await addToCart(product);
  };

  const addToCart = async (product: Product) => {
    setAddingToCart(product.id);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          unitPrice: product.price,
        }),
        credentials: "include",
      });

      if (response.ok) {
        setTimeout(() => incrementCart(), 100);
        setToast({ message: `${product.name} berhasil ditambahkan ke keranjang!`, type: 'success' });
      } else {
        const result = await response.json();
        setToast({ message: result.error || "Gagal menambahkan ke keranjang.", type: 'error' });
      }
    } catch (error) {
      console.error(error);
      setToast({ message: "Terjadi kesalahan saat menambahkan ke keranjang.", type: 'error' });
    } finally {
      setAddingToCart(null);
    }
  };

  const handleLoginConfirm = () => {
    setShowLoginModal(false);
    router.push("/auth/signin");
  };

  const handleLoginCancel = () => {
    setShowLoginModal(false);
    setPendingProduct(null);
  };

  const renderProductCard = (product: Product, index: number) => (
    <Link href={`/katalog/${product.id}`} passHref key={product.id}>
      <div
        className={`cursor-pointer bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-1.5 sm:p-3 lg:p-2 shadow-sm sm:shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 mb-2 group ${isMounted ? 'animate-card-appear' : ''}`}
        style={isMounted ? { animationDelay: `${index * 100}ms` } : undefined}
      >
        <div className="mb-2 sm:mb-4 bg-gray-50 rounded-lg overflow-hidden transform transition-transform duration-300 group-hover:scale-105">
          <Image
            src={product.imageUrl[0] || "/placeholder.svg"}
            alt={product.name}
            width={400}
            height={250}
            className="w-full h-20 sm:h-28 lg:h-24 object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        <h4 className="font-bold text-sm sm:text-base lg:text-sm text-gray-800 mb-1 group-hover:text-green-600 transition-colors">
          {product.name} <span className="font-normal text-gray-600 text-xs sm:text-sm">{product.weight}</span>
        </h4>

        <p className="text-gray-500 text-xs sm:text-sm lg:text-xs mb-1">
          Sisa stok: <span className={product.stock > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
            {product.stock}
          </span>
        </p>

        <p className="text-gray-600 text-[0.65rem] sm:text-xs lg:text-[0.7rem] mb-1 line-clamp-2">{product.description}</p>
        <span className="block text-sm sm:text-base lg:text-sm font-bold text-gray-800 mb-1.5">{formatPrice(product.price)}</span>

        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(product); }}
          disabled={addingToCart === product.id || product.stock === 0}
          className={`w-full py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs lg:text-[10px] transition-all duration-300 flex items-center justify-center gap-1 transform active:scale-95 ${addingToCart === product.id ? "bg-gray-400 cursor-not-allowed" : product.stock === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white hover:shadow-lg hover:scale-105"}`}
        >
          {addingToCart === product.id ? (
            <>
              <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
              <span className="ml-1">Menambahkan...</span>
            </>
          ) : product.stock === 0 ? (
            "Stok Habis"
          ) : (
            <>
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              Tambah Keranjang
            </>
          )}
        </button>
      </div>
    </Link>
  );

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || product.categoryName === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isMounted) return <ProductSkeleton />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="overflow-x-hidden" suppressHydrationWarning>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <LoginModal isOpen={showLoginModal} onClose={handleLoginCancel} onConfirm={handleLoginConfirm} />

      {/* Search Bar */}
      <div className="relative max-w-xl mt-1 mx-auto mb-5 px-2 sm:px-0">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 sm:w-4.5 lg:w-4 h-4 sm:h-4.5 lg:h-4 text-gray-900 animate-pulse-soft" />
          <input
            type="text"
            placeholder="Cari produk terbaik di RegarMart..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 lg:py-2.5 text-sm sm:text-base lg:text-[0.95rem] border border-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-md bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-lg focus:scale-[1.01]"
            autoComplete="off"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center lg:justify-start lg:ml-42 gap-2 sm:gap-2.5 lg:gap-2 mb-4">
        <button onClick={() => setActiveCategory(null)} className={`px-3.5 sm:px-5 lg:px-4 py-1.5 sm:py-2.5 lg:py-2 rounded-full font-medium text-sm sm:text-sm lg:text-[0.8rem] transition-all duration-300 ${activeCategory === null ? "bg-green-500 text-white shadow-lg scale-105" : "bg-green-50 text-green-600 border border-green-300 hover:bg-green-100 hover:scale-105"}`}>Semua</button>
        {categories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.name)}
            className={`px-3.5 sm:px-5 lg:px-4 py-1.5 sm:py-2.5 lg:py-2 rounded-full font-medium text-sm sm:text-sm lg:text-[0.8rem] transition-all duration-300 ${activeCategory === category.name ? "bg-green-500 text-white shadow-lg scale-105" : "bg-green-50 text-green-600 border border-green-300 hover:bg-green-100 hover:scale-105"}`}
            style={{ animationDelay: `${600 + index * 100}ms` }}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Products */}
      {loading ? <ProductSkeleton /> : filteredProducts.length === 0 ? <div>Produk tidak ditemukan</div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{filteredProducts.map((p,i) => renderProductCard(p,i))}</div>}
    </div>
  );
}