"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, ShoppingCart, User, LogOut, Bell, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import NotifikasiCust from "./NotifikasiCust";
import CartCust from "./CartCust";
import { useCart } from "@/context/CartContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { cartCount } = useCart();
  const [notificationCount, setNotificationCount] = useState<number>(0);

  useEffect(() => setMounted(true), []);

 useEffect(() => {
  const fetchProfile = async () => {
    if (!session) return; 
    try {
      const res = await fetch("/api/profile", { credentials: "include" });
      if (!res.ok) {
        console.warn("Profile fetch failed:", res.status);
        return;
      }
      const data = await res.json();
      if (data?.image) setProfileImage(data.image);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  fetchProfile();
}, [session]);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { href: "#beranda", label: "Beranda" },
    { href: "#katalog", label: "Katalog" },
    { href: "#about", label: "Tentang Kami" },
    { href: "#testimoni", label: "Testimoni" },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    router.push(href);
  };

  const handleSignOut = () => {
    setIsProfileDropdownOpen(false);
    signOut({ callbackUrl: "/" });
  };

  const showCustomerIcons = session && session.user?.role !== "ADMIN";

  return (
    <>
      <div className="fixed top-0 right-0 w-full h-24 bg-white -z-10" />

      {/* ---------------- NAVBAR ---------------- */}
      <nav
        className={`fixed top-0 left-0 w-full px-4 lg:px-8 xl:px-[8%] py-5 flex items-center justify-between z-50 transition-all duration-500 ${
          isScrolled ? "bg-white/90 backdrop-blur-xs shadow-xs" : "bg-transparent"
        }`}
      >
        <a
          href="/"
          className="group hover:scale-110 transition-all duration-300 hover:drop-shadow-lg"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("/");
          }}
        >
          <div className="flex items-center">
            <img src="/Logo.png" alt="RegarMart Logo" className="w-48 h-14 object-contain" />
          </div>
        </a>

        {/* ---------------- DESKTOP NAV ---------------- */}
        <ul className="hidden md:flex items-center gap-10 lg:gap-12">
          {navItems.map((item, i) => {
            const isActive =
              pathname && (pathname === item.href || pathname.startsWith(item.href + "/"));
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`relative transition-all duration-300 font-medium text-sm hover:scale-105 group 
                    ${
                      isActive
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
                    className={`absolute -bottom-2 left-0 transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        {/* ---------------- DESKTOP ICONS ---------------- */}
        <div className="hidden md:flex items-center gap-3">
          {showCustomerIcons && <NotifikasiCust notificationCount={notificationCount} />}
          {showCustomerIcons && <CartCust />}

          <div className="flex items-center gap-3 ml-2">
            {session ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 cursor-pointer font-medium text-sm px-4 py-2 rounded-lg hover:bg-white/60"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img
                      src={
                        profileImage
                          ? profileImage
                          : session?.user?.image
                          ? session.user.image
                          : "/default-avatar.png"
                      }
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <span className="text-gray-700 max-w-[100px] truncate">
                    {session.user?.name || "User"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                      isProfileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown */}
                <div
                  className={`absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border py-2 transition-all duration-200 ${
                    isProfileDropdownOpen
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2"
                  }`}
                >
                  <div className="px-4 py-3 border-b">
                    <div className="flex items-center gap-3">
                      <img
                        src={profileImage || session.user?.image || "/default-avatar.png"}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold">{session.user?.name}</p>
                        <p className="text-xs text-gray-500">{session.user?.email}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push("/profil")}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                  >
                    <User className="w-4 h-4" /> Profil
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="cursor-pointer bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all hover:scale-105"
              >
                Log in
              </Link>
            )}
          </div>
        </div>

        {/* ---------------- MOBILE BUTTON ---------------- */}
        <button
          className="md:hidden p-3 rounded-xl hover:bg-white/60 transition-all"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      </nav>

      {/* ---------------- MOBILE MENU ---------------- */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-md z-30 transition-all duration-300 md:hidden ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl z-50 transform transition-all duration-300 md:hidden border-l ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close */}
        <button
          className="absolute top-6 right-6 p-2 rounded-xl hover:bg-white/60 transition-all"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>

        <div className="p-6 pt-20">
          {session && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-orange-50 rounded-xl">
              <div className="flex items-center gap-3">
                <img
                  src={profileImage || session.user?.image || "/default-avatar.png"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold">{session.user?.name}</p>
                  <p className="text-xs text-gray-500">{session.user?.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- MENU MOBILE ---------------- */}
          <ul className="flex flex-col gap-4 text-gray-700 font-medium">
            {navItems.map((item) => (
              <li key={item.href}>
                <button
                  onClick={() => handleNavClick(item.href)}
                  className="w-full text-left py-2 text-sm hover:text-green-600 transition-all"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* ---------------- MOBILE ACTION BUTTONS ---------------- */}
          {session && (
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => router.push("/profil")}
                className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-100"
              >
                <User className="w-5 h-5 text-green-600" /> Profil
              </button>
              <button
                onClick={() => router.push("/keranjang")}
                className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-100"
              >
                <ShoppingCart className="w-5 h-5 text-green-600" /> Keranjang
                {cartCount > 0 && (
                  <span className="ml-auto bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => router.push("/notifikasi")}
                className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-100"
              >
                <Bell className="w-5 h-5 text-green-600" /> Notifikasi
                {notificationCount > 0 && (
                  <span className="ml-auto bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {notificationCount}
                  </span>
                )}
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 py-2 px-3 rounded-lg text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;