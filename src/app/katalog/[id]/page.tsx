"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Eye,
} from "lucide-react";
import Footer from "@/components/Footer";
import NavSearch from "@/components/NavSearch";

const ProductDetailPage = () => {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) return;

    const fetchProduct = async () => {
      try {
        // Perbaikan: gunakan params.id
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

  if (loading) {
    return (
      <>
        <NavSearch />
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <NavSearch />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-500">{error || "Produk tidak ditemukan"}</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavSearch />
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
                    src={
                      // Gunakan imageUrl yang sesuai dengan structure dari CartProduct
                      product.imageUrl?.[selectedImage] || "/placeholder.svg"
                    }
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
                  {/* Tampilkan weight jika ada */}
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
                    {/* Sesuaikan dengan format dari CartProduct - kemungkinan price sudah dalam format string */}
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
                    <span className="ml-2 text-green-600 font-medium">
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
                    disabled={product.stock === 0}
                    className="flex-1 border-2 border-green-500 text-green-500 hover:bg-green-50 disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed font-medium py-2 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Tambah Keranjang
                  </button>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h3 className="font-semibold text-green-600 mb-3 text-sm">
                    Deskripsi Produk
                  </h3>
                  
                  {/* Tampilkan description - sesuaikan dengan struktur dari database */}
                  <div className="text-gray-700 mb-3 leading-relaxed text-sm">
                    {product.description}
                  </div>

                  {/* Tampilkan informasi tambahan jika ada */}
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
                  
                  {/* Tampilkan informasi created/updated jika diperlukan */}
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
                  disabled={product.stock === 0}
                  className="border border-green-500 text-green-500 hover:bg-green-50 disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="sr-only">Tambah Keranjang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetailPage;