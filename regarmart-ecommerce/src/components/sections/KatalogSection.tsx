"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Loader2 } from "lucide-react";
import CartProduct from "@/components/CartProduct"; 

// --- Interface ---
interface Category {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
}

interface ProductWithCategory {
    id: string | number;
    imageUrl: string; 
    name: string;
    weight?: string;
    stock?: number; 
    description?: string;
    price: number; 
    category: Category | null; // ubah jadi bisa null
    rating?: number;
}

interface KatalogGroupProps {
    title: string;
    products: ProductWithCategory[];
    linkHref: string;
}

// --- SUB-KOMPONEN: GROUP PRODUK PER KATEGORI ---
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
                    {products.slice(0, 5).map((product, index) => ( 
                        <div key={product.id} className="w-full min-w-[150px] sm:min-w-0 snap-center">
                            <CartProduct product={product} index={index} /> 
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function KatalogSection() {
    const [allProducts, setAllProducts] = useState<ProductWithCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                console.log("🔄 Fetching products from API...");
                
                const response = await fetch("/api/products"); 
                if (!response.ok) throw new Error(`Gagal mengambil produk: ${response.status}`);
                
                const productsData: ProductWithCategory[] = await response.json();
                
                // DEBUG DETAILED
                console.log("🔍 FULL API RESPONSE:", productsData);
                console.log("📊 PRODUCTS COUNT:", productsData.length);
                
                productsData.forEach((product, index) => {
                    console.log(`📦 Product ${index + 1}:`, {
                        name: product.name,
                        hasCategory: !!product.category,
                        category: product.category,
                        categoryName: product.category?.name,
                        categoryId: product.category?.id
                    });
                });
                
                setAllProducts(productsData);
                
            } catch (err: any) {
                console.error("❌ Fetch error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []); 

    // FILTER: Debug dulu tanpa filter
    const sembakoProducts = allProducts; // Tampilkan semua dulu untuk testing

    // --- LOADING DAN ERROR STATE ---
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
                Error: {error}
            </section>
        );
    }

    return (
        <section id="katalog" className="py-8 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-12">
                
                {/* Tampilkan SEMUA produk dulu untuk debug */}
                <KatalogGroup
                    title="Semua Produk (Debug Mode)"
                    products={sembakoProducts}
                    linkHref="/katalog"
                />

                {/* Detailed Debug Panel */}
                <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-lg font-bold text-blue-800 mb-4">🧩 DEBUG INFORMATION</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded border">
                            <h4 className="font-semibold text-blue-700 mb-2">📊 Statistics</h4>
                            <ul className="text-sm space-y-1">
                                <li>Total Produk: <strong>{allProducts.length}</strong></li>
                                <li>Produk dengan Kategori: <strong>{allProducts.filter(p => p.category).length}</strong></li>
                                <li>Produk tanpa Kategori: <strong>{allProducts.filter(p => !p.category).length}</strong></li>
                            </ul>
                        </div>

                        <div className="bg-white p-4 rounded border">
                            <h4 className="font-semibold text-blue-700 mb-2">🏷️ Kategori yang Ditemukan</h4>
                            {allProducts.filter(p => p.category).length > 0 ? (
                                <ul className="text-sm space-y-1">
                                    {Array.from(new Set(allProducts
                                        .filter(p => p.category)
                                        .map(p => p.category?.name)))
                                        .map((name, idx) => (
                                        <li key={idx}>- <strong>{name}</strong></li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-red-500 text-sm">❌ Tidak ada kategori ditemukan</p>
                            )}
                        </div>
                    </div>

                    {/* Detail Per Produk */}
                    <div className="mt-4 bg-white p-4 rounded border">
                        <h4 className="font-semibold text-blue-700 mb-2">📦 Detail Produk</h4>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            {allProducts.map((product, index) => (
                                <div key={product.id} className="border-b pb-2 last:border-b-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium">{product.name}</p>
                                            <p className={`text-xs ${product.category ? 'text-green-600' : 'text-red-600'}`}>
                                                Kategori: {product.category ? `${product.category.name} (ID: ${product.category.id})` : 'NULL'}
                                            </p>
                                        </div>
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                            #{index + 1}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
            </div>
        </section>
    );
}