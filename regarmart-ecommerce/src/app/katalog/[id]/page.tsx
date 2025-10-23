"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Eye,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  LogIn,
} from "lucide-react";
import Footer from "@/components/Footer";
import NavSearch from "@/components/NavSearch";
import { useCart } from "@/context/CartContext";

// Toast Notification Component
const Toast = ({ 
  message, 
  type, 
  onClose 
}: { 
  message: string; 
  type: 'success' | 'error'; 
  onClose: () => void;
}) => (
  <div className="fixed top-24 right-4 z-[100] animate-slide-in">
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
      type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
    }`}>
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
      )}
      <p className={`text-sm font-medium ${
        type === 'success' ? 'text-green-800' : 'text-red-800'
      }`}>
        {message}
      </p>
      <button
        onClick={onClose}
        className={`ml-2 ${
          type === 'success' ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'
        }`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// Login Confirmation Modal Component
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
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-transparent backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-[#26A81D] rounded-full flex items-center justify-center">
            <LogIn size={32} className="text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Login Diperlukan
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Anda harus login terlebih dahulu untuk menambahkan produk ke keranjang.
          </p>
        </div>

        {/* Actions */}
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

// Loading Skeleton Component
const ProductSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
    <div className="px-6 py-4 border-b border-gray-100">
      <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:ml-10 lg:mr-12">
      <div className="space-y-7">
        <div className="aspect-square bg-gray-200 rounded-xl animate-pulse w-full max-w-[500px] max-h-[500px]" />
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
        </div>
        <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="h-12 bg-gray-200 rounded animate-pulse" />
        <div className="flex gap-4">
          <div className="flex-1 h-12 bg-gray-200 rounded-xl animate-pulse" />
          <div className="flex-1 h-12 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

const ProductDetailPage = () => {
  const params = useParams();
  const { data: session } = useSession();
  const { incrementCart } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!params?.id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (!res.ok) throw new Error("Gagal mengambil produk");
        const data = await res.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params?.id]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      setShowStickyBar(scrollPosition > windowHeight * 0.5);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-hide toast after 5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (product && newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("IDR", "Rp");
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const addToCart = async () => {
    setAddingToCart(true);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity,
          unitPrice: product.price,
        }),
        credentials: "include",
      });

      if (response.ok) {
        setTimeout(() => incrementCart(), 100);
        setToast({ 
          message: `${quantity} produk berhasil ditambahkan ke keranjang!`, 
          type: 'success' 
        });
        setQuantity(1); // Reset quantity
      } else {
        const result = await response.json();
        setToast({ 
          message: result.error || "Gagal menambahkan ke keranjang.", 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error("Error terjadi:", error);
      setToast({ 
        message: "Terjadi kesalahan saat menambahkan ke keranjang.", 
        type: 'error' 
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToCart = async () => {
    // Cek login
    if (!session) {
      setShowLoginModal(true);
      return;
    }

    // Cek role user
    if (session.user?.role === "ADMIN") {
      setToast({ 
        message: "Akun admin tidak dapat menambahkan produk ke keranjang.", 
        type: 'error' 
      });
      return;
    }

    await addToCart();
  };

  const handleLoginConfirm = () => {
    setShowLoginModal(false);
    window.location.href = "/auth/signin";
  };

  const handleLoginCancel = () => {
    setShowLoginModal(false);
  };

  if (loading) {
    return (
      <>
        <NavSearch />
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <ProductSkeleton />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <NavSearch />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              {error || "Produk tidak ditemukan"}
            </p>
            <button
              onClick={handleGoBack}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Kembali
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavSearch />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <LoginModal
        isOpen={showLoginModal}
        onClose={handleLoginCancel}
        onConfirm={handleLoginConfirm}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Product Detail Container */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8 mt-22">
            {/* Back Button */}
            <div className="px-6 py-4 border-b border-gray-100">
              <button
                onClick={handleGoBack}
                className="flex items-center gap-2 text-gray-600 hover:text-green-600 font-medium transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Kembali</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:ml-10 lg:mr-12">
              {/* Product Images */}
              <div className="space-y-7">
                <div className="aspect-square relative bg-gray-50 rounded-xl overflow-hidden w-full max-w-[500px] max-h-[500px]">
                  <img
                    src={product.imageUrl?.[selectedImage] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                  <button className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors">
                    <Eye className="w-5 h-5 text-gray-600" />
                    <span className="sr-only">Klik untuk memperbesar</span>
                  </button>
                </div>

                {/* Thumbnail Images */}
                <div className="flex gap-3">
                  {product.imageUrl?.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                        selectedImage === index
                          ? "border-green-500 ring-2 ring-green-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-contain bg-gray-50"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    {product.name}
                  </h1>
                  {product.weight && (
                    <p className="text-gray-600 mb-2">{product.weight}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">
                      Kategori: {product.category?.name || "Tidak ada kategori"}
                    </span>
                    {product.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-gray-900">
                          {product.rating}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-2xl font-bold text-gray-900">
                    {product.price}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-medium min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Stok: </span>
                    <span className="font-medium text-gray-900">
                      {product.stock}
                    </span>
                    <span className={`ml-2 font-medium ${
                      product.stock > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.stock > 0 ? "Tersedia" : "Habis"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    disabled={product.stock === 0}
                    className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-3 rounded-xl transition-colors"
                  >
                    Beli Sekarang
                  </button>
                  <button 
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || addingToCart}
                    className="flex-1 border-2 border-green-500 text-green-500 hover:bg-green-50 disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed font-medium py-2 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {addingToCart ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Menambahkan...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        <span>Tambah Keranjang</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h3 className="font-semibold text-green-600 mb-3 text-sm">
                    Deskripsi Produk
                  </h3>
                  
                  <div className="text-gray-700 mb-3 leading-relaxed text-sm">
                    {product.description}
                  </div>

                  {product.category && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">Kategori:</span>
                        <span className="ml-2">
                          {product.category.name}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {product.createdAt && (
                    <div className="text-xs text-gray-500 mt-2">
                      Ditambahkan: {new Date(product.createdAt).toLocaleDateString('id-ID')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Produk Terkait
                </h2>
                <button className="text-green-600 hover:text-green-700 font-medium text-sm py-1 px-2 transition-colors">
                  Lihat Semua →
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-500 text-sm">
                (Belum terhubung ke API, masih placeholder)
              </p>
            </div>
          </div>
        </div>

        {/* Sticky Bar */}
        <div
          className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg transition-transform duration-300 z-50 ${
            showStickyBar ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={product.imageUrl?.[0] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-sm truncate">
                  {product.name}
                </h3>
                <div className="text-gray-500 text-xs">Total Harga</div>
                <div className="font-bold text-green-600 text-sm">
                  {product.price}
                </div>
              </div>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="p-1.5 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-3 py-1.5 font-medium text-sm min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  className="p-1.5 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <div className="flex gap-2">
                <button 
                  disabled={product.stock === 0}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm whitespace-nowrap"
                >
                  Beli Sekarang
                </button>
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || addingToCart}
                  className="border border-green-500 text-green-500 hover:bg-green-50 disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                >
                  {addingToCart ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShoppingCart className="w-4 h-4" />
                  )}
                  <span className="sr-only">Tambah Keranjang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      
      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default ProductDetailPage;