import { ReactNode, useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import type { Metadata } from "next";
import AuthCheck from "@/components/AuthCheck";
import { Search, Bell } from "lucide-react";

export const metadata: Metadata = {
  title: "Regar Mart Admin",
};

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Close sidebar when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  return (
    <AuthCheck role="ADMIN">
      <div className="bg-gray-50 flex font-plusJakartaSans min-h-screen">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white shadow-sm px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <img
              src="/LogoAdmin.png"
              alt="RegarMart Admin Logo"
              className="h-8 object-contain"
            />
            <div className="w-10" /> {/* Spacer */}
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between px-6 py-8 bg-white shadow-sm">
            {/* Left Section - Search Bar */}
            <div className="flex-1 max-w-3xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Cari Disini"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            {/* Right Section - Notification & User Info */}
            <div className="flex items-center space-x-6 mr-6">
              {/* Notification */}
              <div className="relative">
                <Bell
                  size={28} 
                  className="text-gray-600 hover:text-orange-500 cursor-pointer transition-colors"
                />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                </span>
              </div>
               <div className="border-r border-gray-300 h-6" />

              {/* User Info */}
              <div className="flex items-center space-x-6">
                <span className="text-base text-gray-600">
                  Hello, <span className="font-semibold text-gray-800">Admin</span>
                </span>
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-200">
                  <img
                    src="/icon.png"
                    alt="Admin Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Header Bar */}
          <div className="lg:hidden flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 p-3 sm:p-4 mb-4 sm:mb-6 bg-white shadow-sm">
            {/* Search Bar */}
            <div className="relative w-full sm:w-2/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Cari disini..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Mobile Notifikasi dan Avatar */}
            <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Bell
                    size={20}
                    className="text-gray-600 hover:text-orange-500 cursor-pointer transition-colors"
                  />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                </div>
                <span className="text-sm sm:text-base font-medium text-gray-800 hidden sm:block">
                  Hello, <span className="font-bold">Admin</span>
                </span>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold overflow-hidden">
                <img
                  src="/icon.png"
                  alt="Admin Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Page Content */}
          <main className="flex-1 p-3 sm:p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </AuthCheck>
  );
}