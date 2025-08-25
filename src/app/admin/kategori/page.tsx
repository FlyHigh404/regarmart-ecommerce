"use client"
import React, { useState } from "react"
import AdminLayout from "../AdminLayout"
import { Search, Plus, Edit, Trash2, Eye, X } from "lucide-react"

const page = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [showAddModal, setShowAddModal] = useState(false)

    // Dummy data kategori
    const categories = [
        { id: 1, name: "Sembako", description: "Kebutuhan pokok sehari-hari" },
        { id: 2, name: "Minuman", description: "Aneka minuman segar dan sehat" },
        { id: 3, name: "Protein", description: "Sumber protein seperti telur, daging, ikan" },
    ]

    const filteredCategories = categories.filter(
        (cat) =>
            cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cat.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <AdminLayout>
            <main className="flex-1 p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Kategori</h1>
                    <p className="text-gray-600 mt-1">Kelola kategori produk Anda</p>
                </div>

                {/* Actions Bar */}
                <div className="flex justify-between items-center mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari kategori..."
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
                        Tambah Kategori
                    </button>
                </div>

                {/* Categories Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-3 px-6 font-medium text-gray-700">Nama Kategori</th>
                                    <th className="text-left py-3 px-6 font-medium text-gray-700">Deskripsi</th>
                                    <th className="text-left py-3 px-6 font-medium text-gray-700">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCategories.map((cat) => (
                                    <tr key={cat.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-6 font-medium text-gray-900">{cat.name}</td>
                                        <td className="py-4 px-6 text-gray-600">{cat.description}</td>
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

                {/* Add Category Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative border border-gray-200">
                            {/* Close Button */}
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-xl font-semibold mb-4">Tambah Kategori Baru</h2>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nama Kategori</label>
                                    <input type="text" className="mt-1 p-2 border border-gray-300 rounded w-full" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                                    <textarea className="mt-1 p-2 border border-gray-300 rounded w-full" rows={3} />
                                </div>

                                <button
                                    type="submit"
                                    className="mt-4 py-2 px-6 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Simpan Kategori
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </AdminLayout>
    )
}
export default page