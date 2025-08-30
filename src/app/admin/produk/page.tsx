"use client";
import { useState, useEffect } from "react";
import AdminLayout from "../AdminLayout";
import { Search, Plus, Edit, Trash2, Filter, ChevronDown } from "lucide-react";
import ProductUploadForm from "@/components/ProductUploadForm";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [products, setProducts] = useState<Array<{
    id: number;
    name: string;
    description: string;
    category: { name: string };
    price: number;
    stock: number;
  }>>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/admin/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <main className="flex-1 p-8 bg-gray-50">
        {/* Actions Bar */}
        <div className="flex justify-between items-center mb-6 gap-4">
          {/* Header */}
          <div className="flex flex-col mb-1"> {/* Gunakan flex-col untuk susunan vertikal */}
            <h1 className="text-3xl font-bold text-gray-900">Tabel produk</h1>
            <p className="text-gray-500 mt-1">Ini adalah daftar produk terbaru</p>
          </div>
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search"
              className="pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Filter size={18} className="text-green-600" />
                Filter
                <ChevronDown size={16} />
              </button>
            </div>

            {/* Add Product Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium"
            >
              <Plus size={18} />
              Tambah Produk
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                  NAMA
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                  KATEGORI
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                  HARGA
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                  STOK
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                  TINDAKAN
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product, index) => (
                <tr
                  key={product.id}
                  className={`hover:bg-gray-50/50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`}
                >
                  <td className="py-5 px-6">
                    <div className="font-medium text-gray-900 text-sm">
                      {product.name}
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <span className="text-gray-600 text-sm">
                      {product.category.name}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <span className="text-gray-900 font-medium text-sm">
                      {product.price.toLocaleString("id-ID")}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <span
                      className={`font-medium text-sm ${product.stock === 0 ? "text-red-600" : "text-gray-900"
                        }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 text-orange-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 px-6 text-center">
                    <div className="text-gray-500">
                      <p className="text-lg font-medium">Tidak ada produk ditemukan</p>
                      <p className="text-sm mt-1">Coba ubah kata kunci pencarian Anda</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />

            {/* Modal */}
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative border border-gray-200">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
                <h2 className="text-xl font-semibold text-gray-900 text-center">Tambah Produk</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <ProductUploadForm />
              </div>
            </div>
          </div>
        )}

        {/* Filter Dropdown */}
        {showFilter && (
          <div className="fixed inset-0 z-40" onClick={() => setShowFilter(false)}>
            <div className="absolute top-32 right-8 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-64">
              <h3 className="font-medium text-gray-900 mb-3">Filter Produk</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Kategori</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option>Semua Kategori</option>
                    <option>Sembako</option>
                    <option>Rumah Tangga</option>
                    <option>Sayur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Status Stok</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option>Semua</option>
                    <option>Tersedia</option>
                    <option>Stok Habis</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                    Terapkan
                  </button>
                  <button
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    onClick={() => setShowFilter(false)}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </AdminLayout>
  );
};

export default Products;