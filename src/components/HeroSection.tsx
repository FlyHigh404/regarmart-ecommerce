"use client"
import { useEffect, useState } from "react"
import { Search, Plus, Banknote, Package, BadgeCheck, HandHeart, LockKeyhole, Clock3 } from "lucide-react"
import Image from "next/image"

const HeroSection = () => {
    const [activeCategory, setActiveCategory] = useState("Semua")
    const [searchQuery, setSearchQuery] = useState("")
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const categories = ["Semua", "Sayur", "Buah", "Daging", "Ikan", "Rumah Tangga"]

    const popularProducts = [
        {
            id: 1,
            name: "Gula Segar",
            weight: "500gr",
            description: "Gudang hari ini, dijamin segar",
            price: "Rp7,500",
            stock: "120",
            image: "/placeholder.svg?height=120&width=120",
        },
        {
            id: 2,
            name: "Susu UHT Full Cream",
            weight: "1 Liter",
            description: "Sumber kalsium, bebas pengawet",
            price: "Rp17,500",
            stock: "120",
            image: "/placeholder.svg?height=120&width=120",
        },
        {
            id: 3,
            name: "Telur Ayam Negeri",
            weight: "10 Butir",
            description: "Masuk gudang hari ini, dijamin",
            price: "Rp15,500",
            stock: "13",
            image: "/placeholder.svg?height=120&width=120",
        },
    ]

    return (
        <section
            id="beranda"
            className="relative min-h-screen bg-white overflow-hidden"
        >
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/2 w-[15rem] h-[20rem] bg-gradient-to-br from-[#6EC568] to-[#26A81D] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob transform -translate-x-1/2"></div>
                {/* right */}
                <div className="absolute -right-50 top-[220px] w-[15rem] h-[20rem] bg-gradient-to-br from-[#6EC568] to-[#26A81D] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob transform -translate-x-1/2"></div>
                {/* left */}
                <div className="absolute right-240 top-[170px] w-[15rem] h-[20rem] bg-gradient-to-br from-[#6EC568] to-[#26A81D] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob transform -translate-x-1/2"></div>
            </div>

            {/* LEFT SIDE */}
            <div className="absolute left-0 lg:top-[220px] w-40 sm:w-64 md:w-80 lg:w-[280px] hidden lg:block">
                <div className="relative animate-float-left">
                    <img
                        src="/Left.png"
                        alt="Fresh vegetables"
                        width={280}
                        height={355}
                        className="object-contain animate-fade-in-left"
                    />

                    {/* Label Terjangkau */}
                    <div className="absolute lg:top-[22px] lg:left-[8px] bg-[#51B94A]/60 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium lg:text-[0.95rem] shadow-md animate-slide-in-left animation-delay-300">
                        Terjangkau
                        <Banknote className="w-5 h-5" />
                    </div>

                    {/* Label Ribuan Produk */}
                    <div className="absolute lg:top-[150px] lg:-right-[25px] bg-[#51B94A]/60 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium lg:text-[0.95rem] shadow-md animate-slide-in-left animation-delay-600">
                        Ribuan Produk
                        <Package className="w-5 h-5" />
                    </div>

                    {/* Label 100% Produk Segar */}
                    <div className="absolute lg:bottom-[22px] lg:left-[45px] bg-[#51B94A]/60 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium lg:text-[0.85rem] shadow-md animate-slide-in-left animation-delay-900">
                        100% Produk Segar
                        <BadgeCheck className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="absolute right-0 lg:top-[220px] w-40 sm:w-64 md:w-80 lg:w-[280px] hidden lg:block">
                <div className="relative animate-float-right">
                    <img
                        src="/Right.png"
                        alt="Fresh vegetables"
                        width={280}
                        height={355}
                        className="object-contain animate-fade-in-right"
                    />

                    {/* Label Dukung Petani */}
                    <div className="absolute lg:top-[22px] lg:right-[8px] bg-[#51B94A]/60 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium lg:text-[0.95rem] shadow-md animate-slide-in-right animation-delay-300">
                        Dukung Petani
                        <HandHeart className="w-5 h-5" />
                    </div>

                    {/* Label Transaksi Aman */}
                    <div className="absolute lg:top-[150px] lg:-left-[25px] bg-[#51B94A]/60 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium lg:text-[0.95rem] shadow-md animate-slide-in-right animation-delay-600">
                        Transaksi Aman
                        <LockKeyhole className="w-5 h-5" />
                    </div>

                    {/* Label Pengiriman Fleksibel */}
                    <div className="absolute lg:bottom-[22px] lg:right-[45px] bg-[#51B94A]/60 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium lg:text-[0.85rem] shadow-md animate-slide-in-right animation-delay-900">
                        Pengiriman Fleksibel
                        <Clock3 className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="relative z-10 container mx-auto px-4 sm:px-8 md:px-8 pt-20 sm:pt-28 md:pt-32 pb-12 sm:pb-16">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Main headline */}
                    <h1
                        className="text-3xl sm:text-3xl md:text-4xl lg:text-[2.4rem] font-bold text-black mb-3 lg:mb-3.5 leading-tight lg:leading-snug animate-fade-in-up"
                    >
                        Belanja Bahan Segar{" "}
                        <span className="relative inline-block p-1 lg:p-1.5">
                            {/* Teks */}
                            <span className="text-green-600 font-bold leading-none">Tanpa Ribet,</span>

                            {/* Border kotak */}
                            <div className="absolute inset-0 border-2 border-green-500 pointer-events-none"></div>
                        </span>

                        <br />
                        <span className="text-green-600 font-bold">Atur Sendiri</span> Jadwal Antar-nya
                    </h1>

                    {/* Subtitle */}
                    <p className="text-gray-600 font-medium text-sm sm:text-base md:text-lg lg:text-[1.02rem] mb-2 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
                        Mau masak besok pagi? Butuh stok dapur buat seminggu ke depan?
                    </p>
                    <p className="text-gray-600 font-medium text-sm sm:text-base md:text-lg lg:text-[1.02rem] mb-3 max-w-2xl mx-auto animate-fade-in-up animation-delay-300">
                        Di <span className="font-bold">RegarMart</span>, kamu tinggal pilih bahan segarnya, biar{" "}
                        <span className="font-bold">kami yang antar</span>.
                    </p>

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
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-3.5 sm:px-5 lg:px-4 py-1.5 sm:py-2.5 lg:py-2 rounded-full font-medium text-sm sm:text-sm lg:text-[0.8rem] transition-all duration-300 animate-slide-in-category ${activeCategory === category
                                    ? "bg-green-500 text-white shadow-lg scale-105"
                                    : "bg-green-50 text-green-600 border border-green-300 hover:bg-green-100 hover:scale-105"
                                    }`}
                                style={{ animationDelay: `${600 + index * 100}ms` }}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Popular products section */}
                    <div className="text-left max-w-7xl mx-auto px-4">
                        <h2 className="text-lg sm:text-xl lg:text-base font-semibold text-gray-700 mb-4 lg:ml-36 animate-fade-in-up animation-delay-800">
                            Produk populer hari ini!
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {popularProducts.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 lg:p-2 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group animate-card-appear"
                                    style={{ animationDelay: `${900 + index * 200}ms` }}
                                >
                                    {/* 1. Gambar */}
                                    <div className="mb-4 bg-gray-50 rounded-xl overflow-hidden transform transition-transform duration-300 group-hover:scale-105">
                                        <Image
                                            src={product.image || "/placeholder.svg"}
                                            alt={product.name}
                                            width={400}
                                            height={250}
                                            className="w-full h-28 lg:h-24 object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>

                                    {/* 2. Nama + Berat */}
                                    <h4 className="font-bold text-base sm:text-lg lg:text-sm text-gray-800 mb-1 group-hover:text-green-600 transition-colors duration-300">
                                        {product.name}{" "}
                                        <span className="font-normal text-gray-600">{product.weight}</span>
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
                                    <span className="block text-base sm:text-xl lg:text-sm font-bold text-gray-800 mb-3">
                                        {product.price}
                                    </span>

                                    {/* 6. Button */}
                                    <button className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 lg:px-2.5 lg:py-2 rounded-lg font-medium text-sm lg:text-sm transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg transform hover:scale-105 active:scale-95">
                                        <Plus className="w-4 h-4 lg:w-4 lg:h-4" />
                                        Tambah ke Keranjang
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom animations */}
            <style jsx>{`
                @keyframes blob {
                    0%, 100% {
                        transform: translateX(-50%) scale(1);
                    }
                    50% {
                        transform: translateX(-50%) scale(1.1);
                    }
                }
                
                @keyframes float-left {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-15px);
                    }
                }
                
                @keyframes float-right {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(15px);
                    }
                }
                
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes fade-in-left {
                    from {
                        opacity: 0;
                        transform: translateX(-50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes fade-in-right {
                    from {
                        opacity: 0;
                        transform: translateX(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes slide-in-left {
                    from {
                        opacity: 0;
                        transform: translateX(-30px) scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0) scale(1);
                    }
                }
                
                @keyframes slide-in-right {
                    from {
                        opacity: 0;
                        transform: translateX(30px) scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0) scale(1);
                    }
                }
                
                @keyframes bounce-rotate {
                    0%, 20%, 50%, 80%, 100% {
                        transform: translateY(0) rotate(12deg);
                    }
                    40% {
                        transform: translateY(-10px) rotate(22deg);
                    }
                    60% {
                        transform: translateY(-5px) rotate(17deg);
                    }
                }
                
                @keyframes pulse-soft {
                    0%, 100% {
                        opacity: 0.4;
                    }
                    50% {
                        opacity: 0.8;
                    }
                }
                
                @keyframes slide-in-category {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                @keyframes card-appear {
                    from {
                        opacity: 0;
                        transform: translateY(40px) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                @keyframes price-pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.8;
                    }
                }
                
                .animate-blob {
                    animation: blob 8s infinite;
                }
                
                .animate-float-left {
                    animation: float-left 6s ease-in-out infinite;
                }
                
                .animate-float-right {
                    animation: float-right 6s ease-in-out infinite 1s;
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                    opacity: 0;
                }
                
                .animate-fade-in-left {
                    animation: fade-in-left 1s ease-out forwards;
                    opacity: 0;
                }
                
                .animate-fade-in-right {
                    animation: fade-in-right 1s ease-out forwards;
                    opacity: 0;
                }
                
                .animate-slide-in-left {
                    animation: slide-in-left 0.8s ease-out forwards;
                    opacity: 0;
                }
                
                .animate-slide-in-right {
                    animation: slide-in-right 0.8s ease-out forwards;
                    opacity: 0;
                }
                
                .animate-bounce-rotate {
                    animation: bounce-rotate 2s infinite;
                }
                
                .animate-pulse-soft {
                    animation: pulse-soft 2s ease-in-out infinite;
                }
                
                .animate-slide-in-category {
                    animation: slide-in-category 0.6s ease-out forwards;
                    opacity: 0;
                }
                
                .animate-card-appear {
                    animation: card-appear 0.8s ease-out forwards;
                    opacity: 0;
                }
                
                .animate-price-pulse {
                    animation: price-pulse 3s ease-in-out infinite;
                }
                
                .animation-delay-200 {
                    animation-delay: 200ms;
                }
                
                .animation-delay-300 {
                    animation-delay: 300ms;
                }
                
                .animation-delay-400 {
                    animation-delay: 400ms;
                }
                
                .animation-delay-500 {
                    animation-delay: 500ms;
                }
                
                .animation-delay-600 {
                    animation-delay: 600ms;
                }
                
                .animation-delay-800 {
                    animation-delay: 800ms;
                }
                
                .animation-delay-900 {
                    animation-delay: 900ms;
                }
            `}</style>
        </section>
    )
}

export default HeroSection