"use client"
import React, { useState } from 'react'
import AdminLayout from '../AdminLayout'
import { Search, Plus, Edit, Trash2, Eye, X } from "lucide-react"

const Products = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [showAddModal, setShowAddModal] = useState(false)

    // Sample product data
    const products = [
        { id: 1, name: "Beras Premium 5kg", category: "Sembako", price: 75000, stock: 50, status: "Aktif" },
        { id: 2, name: "Minyak Goreng 2L", category: "Sembako", price: 35000, stock: 25, status: "Aktif" },
        { id: 3, name: "Gula Pasir 1kg", category: "Sembako", price: 15000, stock: 0, status: "Habis" },
        { id: 4, name: "Telur Ayam 1kg", category: "Protein", price: 28000, stock: 30, status: "Aktif" },
        { id: 5, name: "Susu UHT 1L", category: "Minuman", price: 18000, stock: 40, status: "Aktif" },
    ]

    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <AdminLayout>
            <main className="flex-1 p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Managemen Produk</h1>
                    <p className="text-gray-600 mt-1">Kelola semua produk di toko Anda</p>
                </div>

                {/* Actions Bar */}
                <div className="flex justify-between items-center mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari produk atau kategori..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-80"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Plus size={20} />
                        Tambah Produk
                    </button>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-3 px-6 font-medium text-gray-700">Nama Produk</th>
                                    <th className="text-left py-3 px-6 font-medium text-gray-700">Kategori</th>
                                    <th className="text-left py-3 px-6 font-medium text-gray-700">Harga</th>
                                    <th className="text-left py-3 px-6 font-medium text-gray-700">Stok</th>
                                    <th className="text-left py-3 px-6 font-medium text-gray-700">Status</th>
                                    <th className="text-left py-3 px-6 font-medium text-gray-700">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-6 font-medium text-gray-900">{product.name}</td>
                                        <td className="py-4 px-6 text-gray-600">{product.category}</td>
                                        <td className="py-4 px-6 text-gray-900">Rp {product.price.toLocaleString("id-ID")}</td>
                                        <td className="py-4 px-6">
                                            <span className={`${product.stock === 0 ? "text-red-600" : "text-gray-900"}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === "Aktif"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {product.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <button className="p-1 text-gray-500 hover:text-blue-600 transition-colors">
                                                    <Eye size={16} />
                                                </button>
                                                <button className="p-1 text-gray-500 hover:text-green-600 transition-colors">
                                                    <Edit size={16} />
                                                </button>
                                                <button className="p-1 text-gray-500 hover:text-red-600 transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add Product Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative border border-gray-200">
                            {/* Close Button */}
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-xl font-semibold mb-4">Tambah Produk Baru</h2>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nama Produk</label>
                                    <input type="text" className="mt-1 p-2 border border-gray-300 rounded w-full" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Kategori</label>
                                    <input type="text" className="mt-1 p-2 border border-gray-300 rounded w-full" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Harga</label>
                                    <input type="number" className="mt-1 p-2 border border-gray-300 rounded w-full" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Stok</label>
                                    <input type="number" className="mt-1 p-2 border border-gray-300 rounded w-full" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <select className="mt-1 p-2 border border-gray-300 rounded w-full">
                                        <option value="Aktif">Aktif</option>
                                        <option value="Habis">Habis</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Gambar Produk</label>
                                    <input type="file" multiple className="mt-1 p-2 border border-gray-300 rounded w-full" />
                                </div>

                                <button
                                    type="submit"
                                    className="mt-4 py-2 px-6 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Simpan Produk
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </AdminLayout>
    )
}

export default Products