"use client"
import { useState, useEffect } from "react"
import { Menu, X, ShoppingCart, User, LogOut, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const { data: session, status } = useSession()

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

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

    const handleLogout = async () => {
        await signOut({ redirect: false })
        router.push("/")
        setIsUserDropdownOpen(false)
    }

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
                    href="/beranda"
                    className="group hover:scale-110 transition-all duration-300 hover:drop-shadow-lg"
                    onClick={(e) => {
                        e.preventDefault()
                        handleNavClick("/beranda")
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
                       const isActive = pathname === item.href
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
                                    <span
                                        className={`absolute -bottom-2 left-0 h-1 rounded-full transition-all duration-300 bg-gradient-to-r from-[#6EC568] to-[#26A81D] 
                                            ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                                    />
                                </a>
                            </li>
                        )
                    })}
                </ul>

                <div className="hidden md:flex items-center gap-3 animate-fade-in-down" style={{ animationDelay: "0.5s" }}>
                    {/* Cart icon with badge */}
                    <button 
                        className="cursor-pointer relative p-3 rounded-xl transition-all duration-300 hover:scale-105"
                        onClick={() => router.push("/keranjang")}
                    >
                        <ShoppingCart className="w-5 h-5 text-[#4BBF42]" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                            2
                        </span>
                    </button>

                    {/* Auth buttons - Conditional rendering based on session */}
                    {status === "authenticated" ? (
                        <div className="relative ml-2">
                            <button
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                            >
                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-green-500">
                                    {session.user?.image ? (
                                        <Image
                                            src={session.user.image}
                                            alt="User Avatar"
                                            width={40}
                                            height={40}
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-green-100 flex items-center justify-center">
                                            <User className="w-5 h-5 text-green-600" />
                                        </div>
                                    )}
                                </div>
                                <span className="text-sm font-medium text-gray-700">
                                    {session.user?.name?.split(' ')[0] || 'Profile'}
                                </span>
                            </button>

                            {/* User dropdown menu */}
                            {isUserDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">
                                            {session.user?.name || 'User'}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {session.user?.email}
                                        </p>
                                    </div>
                                    <Link
                                        href="/profile"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setIsUserDropdownOpen(false)}
                                    >
                                        <User className="w-4 h-4 mr-2" />
                                        Profile
                                    </Link>
                                    <Link
                                        href="/settings"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setIsUserDropdownOpen(false)}
                                    >
                                        <Settings className="w-4 h-4 mr-2" />
                                        Settings
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 ml-2">
                            <Link 
                                href="/auth/sign-in" 
                                className="cursor-pointer font-medium text-sm transition-all duration-300 px-4 py-2 rounded-lg bg-gradient-to-r from-[#6EC568] to-[#26A81D] bg-clip-text text-transparent hover:opacity-80"
                            >
                                Log in
                            </Link>

                            <Link 
                                href="/auth/sign-in"
                                className="cursor-pointer bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 hover:shadow-xl hover:scale-105"
                            >
                                Sign up
                            </Link>
                        </div>
                    )}
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
                    {/* Mobile nav links */}
                    <ul className="space-y-3">
                        {navItems.map((item, i) => {
                            const isActive = pathname === item.href
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
                        <button 
                            className="cursor-pointer relative p-3 rounded-xl w-full flex items-center justify-center border border-gray-300 hover:border-green-500 transition-all duration-300"
                            onClick={() => {
                                router.push("/keranjang")
                                setIsMobileMenuOpen(false)
                            }}
                        >
                            <ShoppingCart className="w-5 h-5 text-[#4BBF42] mr-2" />
                            <span className="text-sm font-semibold">Keranjang</span>
                            <span className="absolute top-2 right-4 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                2
                            </span>
                        </button>

                        {/* Auth buttons - Conditional rendering */}
                        {status === "authenticated" ? (
                            <>
                                <Link
                                    href="/profile"
                                    className="block w-full text-center font-semibold text-sm px-4 py-3 rounded-lg bg-gradient-to-r from-[#6EC568] to-[#26A81D] bg-clip-text text-transparent hover:opacity-80"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    My Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout()
                                        setIsMobileMenuOpen(false)
                                    }}
                                    className="w-full cursor-pointer bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-xl"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/auth/login"
                                    className="block w-full text-center font-semibold text-sm px-4 py-3 rounded-lg bg-gradient-to-r from-[#6EC568] to-[#26A81D] bg-clip-text text-transparent hover:opacity-80"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="w-full cursor-pointer bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-xl"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Sign up
                                </Link>
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