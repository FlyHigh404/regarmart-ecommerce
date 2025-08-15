import { ReactNode } from "react";
import Sidebar from "./components/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regar Mart Admin", 
};

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="bg-gray-50 flex font-plusJakartaSans min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  ); 
}