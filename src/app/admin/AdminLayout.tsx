import { ReactNode, useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import type { Metadata } from "next";
import AuthCheck from "@/components/AuthCheck";

export const metadata: Metadata = {
  title: "Regar Mart Admin",
};

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
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
        {/* NO OVERLAY - Completely removed for clean mobile experience */}
        
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header - Only show on mobile */}
          <div className="lg:hidden bg-white shadow-sm px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <img
              src="/LogoAdmin.png"
              alt="RegarMart Admin Logo"
              className="h-8 object-contain"
            />
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
          
          {/* Content */}
          <main className="flex-1 p-3 sm:p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </AuthCheck>
  );
}