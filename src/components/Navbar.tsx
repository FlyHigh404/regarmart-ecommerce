"use client"
import { useState, useEffect, useRef } from "react"
import { Menu, X, ShoppingCart, User, Settings, LogOut, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
    const [mounted, setMounted] = useState(false);
    const router = useRouter()
    const pathname = usePathname()
    const { data: session, status } = useSession();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        if (mounted) {
            window.addEventListener("scroll", handleScroll);
            return () => window.removeEventListener("scroll", handleScroll);
        }
    }, [mounted]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("/api/cart");
        if (!res.ok) {
          console.error("Gagal fetch cart");
          return;
        }
        const data = await res.json();
        setCartCount(data?.orderItems?.length || 0);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    // ✅ hanya fetch jika ada session DAN bukan admin
    if (session && session.user?.role !== "ADMIN") {
      fetchCart();
    } else {
      // ✅ kalau admin atau belum login, jangan tampilkan badge
      setCartCount(0);
    }
  }, [session]);

    /* nav links */
    const navItems = [
        { href: "/", label: "Beranda" },
        { href: "/katalog", label: "Katalog" },
        { href: "/tentang-kami", label: "Tentang Kami" },
        { href: "/testimoni", label: "Testimoni" },
    ]

    /* smooth scroll helper */
    const handleNavClick = (href: string) => {
        setIsMobileMenuOpen(false)
        router.push(href)
    }

    const handleSignOut = () => {
        setIsProfileDropdownOpen(false);
        signOut({ callbackUrl: "/" });
    };

    return (
        <>
            <div className="fixed top-0 right-0 w-full h-24 bg-white -z-10" />

            {/* ---------------- NAVBAR ---------------- */}
            <nav
                className={`fixed top-0 left-0 w-full px-4 lg:px-8 xl:px-[8%] py-5 flex items-center justify-between z-50 transition-all duration-500 ${isScrolled
                    ? "bg-white/90 backdrop-blur-xs shadow-xs"
                    : "bg-transparent"
                    }`}
            >
                <a
                    href="/"
                    className="group hover:scale-110 transition-all duration-300 hover:drop-shadow-lg"
                    onClick={(e) => {
                        e.preventDefault()
                        handleNavClick("/")
                    }}
                >
                    <div className="flex items-center">
                        <img
                            src="/Logo.png"
                            alt="RegarMart Logo"
                            className="w-48 h-14 object-contain"
                        />
                    </div>
                </a>

                <ul className="hidden md:flex items-center gap-10 lg:gap-12">
                    {navItems.map((item, i) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                        return (
                            <li
                                key={item.href}
                                className="animate-fade-in-down"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <a
                                    href={item.href}
                                    className={`relative transition-all duration-300 font-medium text-sm hover:scale-105 group 
                        ${isActive
                                            ? "bg-gradient-to-r from-[#6EC568] to-[#26A81D] bg-clip-text text-transparent"
                                            : "text-gray-700 hover:bg-gradient-to-r hover:from-[#6EC568] hover:to-[#26A81D] hover:bg-clip-text hover:text-transparent"
                                        }`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleNavClick(item.href);
                                    }}
                                >
                                    {item.label}
                                    <img
                                        src="/Line 66.png"
                                        alt="Active Line"
                                        className={`absolute -bottom-2 left-0 transition-all duration-300 
                            ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                                        style={{ width: isActive ? '100%' : '0' }}
                                    />
                                </a>
                            </li>
                        )
                    })}
                </ul>

                <div className="hidden md:flex items-center gap-3 animate-fade-in-down" style={{ animationDelay: "0.5s" }}>
                    {/* Cart icon with badge */}
                    <a href="/cart" className="cursor-pointer relative p-3 rounded-xl transition-all duration-300 hover:scale-105">
                        <ShoppingCart className="w-5 h-5 text-[#4BBF42]" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                            {cartCount}
                        </span>
                    </a>

                    {/* Auth buttons */}
                    <div className="flex items-center gap-3 ml-2">
                        {session ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="flex items-center gap-2 cursor-pointer font-medium text-sm transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/60 hover:shadow-sm"
                                >
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r from-[#6EC568] to-[#26A81D] p-[1px]">
                                        {session.user?.image ? (
                                            <img
                                                src={session.user?.image}
                                                alt="Profile"
                                                className="w-full h-full rounded-full object-cover bg-white"
                                            />
                                        ) : (
                                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                                <User className="w-4 h-4 text-gray-600" />
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-gray-700 max-w-[100px] truncate">
                                        {session.user?.name || session.user?.email?.split('@')[0] || 'User'}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Profile Dropdown */}
                                <div className={`absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 transition-all duration-200 ${isProfileDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-[#6EC568] to-[#26A81D] p-[1px]">
                                                {session.user?.image ? (
                                                    <img
                                                        src={session.user?.image}
                                                        alt="Profile"
                                                        className="w-full h-full rounded-full object-cover bg-white"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                                        <User className="w-5 h-5 text-gray-600" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">
                                                    {session.user?.name || 'User Name'}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {session.user?.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="py-1">
                                        <button
                                            onClick={() => {
                                                setIsProfileDropdownOpen(false);
                                                router.push('/profil');
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-200"
                                        >
                                            <User className="w-4 h-4" />
                                            Profile
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsProfileDropdownOpen(false);
                                                router.push('/settings');
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-200"
                                        >
                                            <Settings className="w-4 h-4" />
                                            Settings
                                        </button>
                                        <hr className="my-1 border-gray-100" />
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors duration-200"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Log out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link href="/auth/signin" className="cursor-pointer font-medium text-sm transition-all duration-300 px-4 py-2 rounded-lg bg-gradient-to-r from-[#6EC568] to-[#26A81D] bg-clip-text text-transparent hover:opacity-80">
                                    Log in
                                </Link>
                                <Link href="/auth/signup" className="cursor-pointer bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 hover:shadow-xl hover:scale-105">
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {!isMobileMenuOpen && (
                    <button
                        className="md:hidden p-3 rounded-xl hover:bg-white/60 transition-all duration-300 hover:scale-105"
                        onClick={() => setIsMobileMenuOpen(true)}
                        aria-label="Open mobile menu"
                    >
                        <Menu className="w-6 h-6 text-gray-700" />
                    </button>
                )}
            </nav>

            {/* ---------------- MOBILE MENU ---------------- */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-md z-40 transition-all duration-300 md:hidden ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            <div
                className={`fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl z-50 transform transition-all duration-300 md:hidden border-l border-white/20 ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Close button */}
                <button
                    className="absolute top-6 right-6 p-2 rounded-xl hover:bg-white/60 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Close mobile menu"
                >
                    <X className="w-6 h-6 text-gray-700" />
                </button>

                <div className="p-6 pt-20">
                    {/* User info for mobile when logged in */}
                    {session && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-orange-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-[#6EC568] to-[#26A81D] p-[1px]">
                                    {session.user?.image ? (
                                        <img
                                            src={session.user.image}
                                            alt="Profile"
                                            className="w-full h-full rounded-full object-cover bg-white"
                                        />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                            <User className="w-6 h-6 text-gray-600" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {session.user?.name || 'User Name'}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {session.user?.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mobile nav links */}
                    <ul className="space-y-3">
                        {navItems.map((item, i) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                            return (
                                <li key={item.href} className="animate-slide-in-right" style={{ animationDelay: `${i * 0.1}s` }}>
                                    <a
                                        href={item.href}
                                        className={`block py-4 px-4 rounded-xl transition-all duration-300 font-semibold text-base 
                                            ${isActive
                                                ? "text-green-600 bg-gradient-to-r from-green-50 to-orange-50 shadow-sm"
                                                : "text-gray-700 hover:text-green-600 hover:bg-white/60 hover:shadow-sm"
                                            }`}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            handleNavClick(item.href)
                                        }}
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            )
                        })}
                    </ul>

                    <div className="mt-8 border-t border-gray-200 pt-6 space-y-4">
                        {/* Cart icon */}
                        <button className="cursor-pointer relative p-3 rounded-xl w-full flex items-center justify-center border border-gray-300 hover:border-green-500 transition-all duration-300">
                            <ShoppingCart className="w-5 h-5 text-[#4BBF42] mr-2" />
                            <span className="text-sm font-semibold">Keranjang</span>
                            <span className="absolute top-2 right-4 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                {cartCount}
                            </span>
                        </button>

                        {/* Auth buttons for mobile */}
                        {session ? (
                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        router.push('/profile');
                                    }}
                                    className="w-full cursor-pointer border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:border-green-500 hover:text-green-600 flex items-center justify-center gap-2"
                                >
                                    <User className="w-4 h-4" />
                                    Profile
                                </button>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full cursor-pointer bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-xl flex items-center justify-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Log out
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="block w-full text-center font-semibold text-sm px-4 py-3 rounded-lg bg-gradient-to-r from-[#6EC568] to-[#26A81D] bg-clip-text text-transparent hover:opacity-80"
                                >
                                    Log in
                                </Link>
                                <button
                                    className="w-full cursor-pointer bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-xl"
                                >
                                    Sign up
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slide-in-right {
                    from { opacity: 0; transform: translateX(30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.8s ease-out forwards;
                    opacity: 0;
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.5s ease-out forwards;
                    opacity: 0;
                }
                html {
                    scroll-behavior: smooth;
                }
            `}</style>
        </>
    )
}

export default Navbar