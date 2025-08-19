"use client"
import { useState, useEffect } from "react"
import { ArrowLeft, Star, Plus, Minus, ShoppingCart, Eye } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const ProductDetailPage = () => {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showStickyBar, setShowStickyBar] = useState(false)

  // Sample product data
  const product = {
    id: 1,
    name: "Beras Raja Platinum | Beras Slyp Super Quality | 10 Kilogram",
    price: 168500,
    rating: 4.8,
    reviews: 157,
    stock: 29,
    images: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop",
    ],
    description: [
      "Raja Platinum Beras Super 10 kg",
      "Beras yang pulen dan tanpa pemutih",
      "Dihasilkan dari padi berkualitas",
    ],
    fullDescription:
      "RAJA PLATINUM Beras Super 10 kg - Beras yang pulen dan tanpa pemutih. Dihasilkan dari padi berkualitas. Hadir dengan kemasan 10 kg. Cocok dijadikan bahan baku masakan untuk keluarga tercinta.",
    certificateNumber: "ID16410000047780720",
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      // Show sticky bar when scrolled past 50% of viewport height
      setShowStickyBar(scrollPosition > windowHeight * 0.5)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const relatedProducts = [
    {
      id: 1,
      name: "Fortuna Beras Premium 5kg",
      brand: "Fortuna",
      weight: "5kg",
      price: 73500,
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop",
    },
    {
      id: 2,
      name: "Rio Beras Premium 5kg",
      brand: "Rio",
      weight: "5kg",
      price: 74000,
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&h=200&fit=crop",
    },
    {
      id: 3,
      name: "Sumo Beras Premium 5kg",
      brand: "Sumo",
      weight: "5kg",
      price: 62500,
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=200&fit=crop",
    },
    {
      id: 4,
      name: "Rio Beras Premium 5kg",
      brand: "Rio",
      weight: "5kg",
      price: 74000,
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&h=200&fit=crop",
    },
  ]

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("IDR", "Rp")
  }

  const handleGoBack = () => {
    // In real app, this would use router.back()
    console.log("Go back")
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Product Detail Container */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8 mt-22">
          {/* Back Button - Outside the main container */}
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
                {" "}
                {/* Adjust max width and height */}
                <img
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
                {/* Zoom icon */}
                <button className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors">
                  <Eye className="w-5 h-5 text-gray-600" />
                  <span className="sr-only">Klik untuk memperbesar</span>
                </button>
              </div>

              {/* Thumbnail images */}
              <div className="flex gap-3">
                {product.images.map((image, index) => (
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
              {/* Product Title & Rating */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500">Terjual {product.reviews}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-gray-900">{product.rating}</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div>
                <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
              </div>

              {/* Quantity & Stock */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium min-w-[60px] text-center">{quantity}</span>{" "}
                  {/* Reduced padding and width */}
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
                  <span className="font-medium text-gray-900">{product.stock}</span>
                  <span className="ml-2 text-green-600 font-medium">Tersedia</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-3 rounded-xl transition-colors">
                  Beli Sekarang
                </button>
                <button className="flex-1 border-2 border-green-500 text-green-500 hover:bg-green-50 font-medium py-2 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Tambah Keranjang
                </button>
              </div>

              {/* Product Description */}
              <div className="border-t border-gray-100 pt-4">
                {" "}
                {/* Reduced top padding */}
                <h3 className="font-semibold text-green-600 mb-3 text-sm">Deskripsi Produk</h3>{" "}
                {/* Reduced font size and margin */}
                <ul className="space-y-2 mb-3">
                  {" "}
                  {/* Reduced space between list items */}
                  {product.description.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      {" "}
                      {/* Reduced gap */}
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-1 flex-shrink-0"></span>{" "}
                      {/* Reduced margin top */}
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-gray-700 mb-3 leading-relaxed text-sm">{product.fullDescription}</p>{" "}
                {/* Reduced bottom margin and font size */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  {" "}
                  {/* Reduced padding and margin */}
                  <div className="text-xs text-gray-600">
                    {" "}
                    {/* Reduced font size */}
                    <span className="font-medium">No. Sertifikat Halal:</span>
                    <span className="ml-2 font-mono">{product.certificateNumber}</span>
                  </div>
                </div>
                <button className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors">
                  {" "}
                  {/* Reduced font size */}
                  Lihat selengkapnya →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Container */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Produk Terkait</h2>
              <button className="text-green-600 hover:text-green-700 font-medium text-sm py-1 px-2 transition-colors">
                Lihat Semua →
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {" "}
              {/* Responsive grid */}
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-lg hover:border-green-200 transition-all duration-200 cursor-pointer"
                >
                  <div className="aspect-square mb-3 bg-gray-50 rounded-lg overflow-hidden">
                    <img
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">
                    {relatedProduct.name}
                  </h3>

                  <div className="text-xs text-gray-500 mb-3">
                    {relatedProduct.brand} • {relatedProduct.weight}
                  </div>

                  <div className="font-bold text-gray-900 mb-3 text-sm">{formatPrice(relatedProduct.price)}</div>

                  <button className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2.5 px-3 rounded-lg transition-colors">
                    + Tambah ke Keranjang
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg transition-transform duration-300 z-50 ${
          showStickyBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Product Image */}
            <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 text-sm truncate">{product.name}</h3>
              <div className="text-gray-500 text-xs">Total Harga</div>
              <div className="font-bold text-green-600 text-sm">{formatPrice(product.price * quantity)}</div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="p-1.5 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-3 py-1.5 font-medium text-sm min-w-[40px] text-center">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stock}
                className="p-1.5 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm whitespace-nowrap">
                Beli Sekarang
              </button>
              <button className="border border-green-500 text-green-500 hover:bg-green-50 font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center">
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
  )
}

export default ProductDetailPage
