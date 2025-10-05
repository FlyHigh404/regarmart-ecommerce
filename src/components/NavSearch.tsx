// NavSearch.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import {
    ShoppingCart,
    User,
    Settings,
    LogOut,
    ChevronDown,
    Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import NotifikasiCust from "./NotifikasiCust"; 
import CartCust from "./CartCust";

const NavSearch = () => {
    const { data: session } = useSession();
    const [cartCount, setCartCount] = useState(0);
    const [notificationCount, setNotificationCount] = useState(0); 
    
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState("");

    // Fetch cart items
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await fetch("/api/cart");
                if (!res.ok) return;
                const data = await res.json();
                setCartCount(data?.orderItems?.length || 0);
            } catch (err) {
                console.error("Error fetch cart:", err);
            }
        };

        if (session && session.user?.role !== "ADMIN") {
            fetchCart();
            // Di sini Anda bisa menambahkan fetch notifikasi jika ada API:
            // fetch('/api/notifications/count').then(res => res.json()).then(data => setNotificationCount(data.count));
        } else {
            setCartCount(0);
            setNotificationCount(0);
        }
    }, [session]);

    // Close dropdown when click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            // Logic ini hanya untuk dropdown Profile
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignOut = () => {
        setIsProfileDropdownOpen(false);
        signOut({ callbackUrl: "/" });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/katalog?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    // Tentukan apakah user non-admin sudah login untuk menampilkan ikon
    const showIcons = session && session.user?.role !== "ADMIN";

    return (
        <>
            {/* Navbar */}
            <nav className="fixed top-0 left-0 w-full h-20 bg-white shadow z-50 px-6 flex items-center justify-between">
                {/* Logo */}
                <a href="/" className="flex items-center gap-2">
                    <img src="/Logo.png" alt="Logo" className="h-12 w-auto" />
                </a>

                {/* Search (Desktop only) */}
                <form
                    onSubmit={handleSearchSubmit}
                    className="flex-1 max-w-2xl mx-6 hidden md:block"
                >
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari produk terbaik di RegarMart..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all duration-200"
                        />
                    </div>
                </form>

                {/* Right side */}
                <div className="flex items-center gap-6">
                    
                    {/* NOTIFIKASI */}
                    {showIcons && (
                        <NotifikasiCust 
                            notificationCount={notificationCount} 
                        />
                    )}

                    {/* Cart */}
                    {showIcons && (
                        <CartCust cartCount={cartCount} />
                    )}


                    {/* Profile */}
                    {session ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition"
                            >
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r from-green-500 to-green-700 p-[1px]">
                                    {session.user?.image ? (
                                        <img
                                            src={session.user.image}
                                            alt="Profile"
                                            className="w-full h-full rounded-full object-cover bg-white"
                                        />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                            <User className="w-4 h-4 text-gray-600" />
                                        </div>
                                    )}
                                </div>
                                <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate hidden sm:block">
                                    {session.user?.name || "User"}
                                </span>
                                <ChevronDown
                                    className={`w-4 h-4 text-gray-600 transition-transform ${
                                        isProfileDropdownOpen ? "rotate-180" : ""
                                    } hidden sm:block`}
                                />
                            </button>

                            {/* Dropdown */}
                            <div
                                className={`absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-xl border border-gray-100 transition-all duration-200 ${
                                    isProfileDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"
                                }`}
                                style={{ zIndex: 60 }} 
                            >
                                <button
                                    onClick={() => { router.push("/profil"); setIsProfileDropdownOpen(false); }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <User className="w-4 h-4" /> Profil
                                </button>
                                <button
                                    onClick={() => { router.push("/settings"); setIsProfileDropdownOpen(false); }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <Settings className="w-4 h-4" /> Settings
                                </button>
                                <hr />
                                <button
                                    onClick={handleSignOut}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" /> Log out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => router.push("/login")}
                            className="px-5 py-2.5 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
                        >
                            Login
                        </button>
                    )}
                </div>
            </nav>

            {/* Search (Mobile only) */}
            <div className="mt-20 px-4 md:hidden">
                <form onSubmit={handleSearchSubmit}>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari produk..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all duration-200"
                        />
                    </div>
                </form>
            </div>
        </>
    );
};

export default NavSearch;