"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Loader2 } from "lucide-react";
import CartProduct from "@/components/CartProduct"; 

// --- Interface Kategori Baru ---
interface Category {
    id: string;
    name: string; // Nama kategori
}

// --- Interface Produk yang Diperbarui ---
interface ProductWithCategory {
    id: string | number;
    imageUrl: string; 
    name: string;
    weight?: string;
    stock?: number; 
    description?: string;
    price: number; 
    // Perbaikan: Asumsi 'category' adalah objek yang di-include dari Prisma
    category: Category; 
    rating?: number;
}


interface KatalogGroupProps {
    title: string;
    products: ProductWithCategory[];
    linkHref: string;
}

// --- SUB-KOMPONEN: GROUP PRODUK PER KATEGORI (Tidak ada perubahan) ---
const KatalogGroup: React.FC<KatalogGroupProps> = ({ title, products, linkHref }) => {
    if (products.length === 0) return null; 

    return (
        <div className="mb-12">
            {/* Header Kategori */}
            <div className="flex justify-between items-center mb-6 px-4 md:px-0">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h3>
                <Link 
                    href={linkHref} 
                    className="flex items-center text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
                >
                    Lihat Semua
                    <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
            </div>

            {/* Product Display */}
            <div className="relative">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5 overflow-x-auto pb-4 snap-x snap-mandatory">
                    {/* Tampilkan hingga 5 produk teratas di section ini */}
                    {products.slice(0, 5).map((product, index) => ( 
                        <div key={product.id} className="w-full min-w-[150px] sm:min-w-0 snap-center">
                            {/* Memastikan CartProduct menerima ProductWithCategory */}
                            <CartProduct product={product} index={index} /> 
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


// --- MAIN KOMPONEN: KATALOG SECTION (FEATCHING DATA) ---
export default function KatalogSection() {
    // Gunakan interface yang diperbarui
    const [allProducts, setAllProducts] = useState<ProductWithCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Asumsi endpoint ini mengembalikan array Product dengan Category di-include
                const response = await fetch("/api/products"); 
                if (!response.ok) {
                    throw new Error("Gagal mengambil data produk.");
                }
                // Asumsi data yang diterima sesuai dengan ProductWithCategory
                const data: ProductWithCategory[] = await response.json();
                setAllProducts(data); 
            } catch (err) {
                console.error(err); // Log error untuk debugging
                setError("Terjadi kesalahan saat memuat katalog. Cek konsol server dan browser.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []); 

    // --- LOADING DAN ERROR STATE (Tidak ada perubahan) ---
    if (loading) {
        return (
            <section id="katalog" className="py-16 flex justify-center items-center">
                <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                <span className="ml-3 text-gray-600">Memuat Katalog Produk...</span>
            </section>
        );
    }

    if (error) {
        return (
            <section id="katalog" className="py-16 text-center text-red-600">
                {error}
            </section>
        );
    }
    
    // Jika tidak ada produk sama sekali
    if (allProducts.length === 0) {
        return (
            <section id="katalog" className="py-16 text-center text-gray-500">
                Katalog kosong. Belum ada produk yang tersedia saat ini.
            </section>
        );
    }

    
    const frozenFoodProducts = allProducts.filter(p => p.category && p.category.name === "sembako");
    const sayurProducts = allProducts.filter(p => p.category && p.category.name === "sayur");
    // Gunakan p.category && untuk menghindari error jika data category hilang/null

    return (
        <section id="katalog" className="py-8 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-12">
                
                {/* Frozen Food Katalog */}
                <KatalogGroup
                    title="Frozen Food"
                    products={frozenFoodProducts}
                    linkHref="/katalog"
                />

                {/* Sembako Katalog */}
                <KatalogGroup
                    title="Sayuran Segar"
                    products={sayurProducts}
                    linkHref="/katalog"
                />
                
            </div>
        </section>
    );
}