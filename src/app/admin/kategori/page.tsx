"use client";
import { useState, useEffect } from "react";
import AdminLayout from "../AdminLayout";
import { Search, Plus, Edit, Trash2, X, Filter, ChevronDown } from "lucide-react";

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<
    Array<{ id: number; name: string; description: string }>
  >([]);

  // filter states
  const [filterOption, setFilterOption] = useState("Semua");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterOption === "Semua"
        ? true
        : filterOption === "Dengan Deskripsi"
          ? cat.description.trim() !== ""
          : filterOption === "Tanpa Deskripsi"
            ? cat.description.trim() === ""
            : true;

    return matchesSearch && matchesFilter;
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create category");
      }

      const newCat = await response.json();
      setCategories((prev) => [...prev, newCat]);

      setFormData({ name: "", description: "" });
      setShowAddModal(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <main className="flex-1 bg-gray-50 pt-6">
        {/* Main Container with shadow and rounded corners */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header Section */}
          <div className="p-4 sm:pt-6 sm:pb-0 bg-white">
            <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
              {/* Header Text */}
              <div className="flex flex-col">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tabel Kategori</h1>
                <p className="text-gray-500 text-sm sm:text-base mt-1">Ini adalah daftar kategori produk</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                {/* Search */}
                <div className="relative order-1 sm:order-1">
                  <Search
                    className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Cari kategori..."
                    className="pl-10 sm:pl-12 pr-4 sm:pr-6 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none focus:border-transparent w-full sm:w-64 lg:w-80 bg-white text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Filter and Add buttons container */}
                <div className="flex space-x-2 sm:space-x-3 order-2 sm:order-2">
                  {/* Filter Button */}
                  <div className="relative flex-1 sm:flex-none">
                    <button
                      onClick={() => setShowFilter(!showFilter)}
                      className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center gap-2 sm:gap-3 transition-colors text-sm w-full sm:w-auto"
                    >
                      <Filter className="text-green-600 w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Filter</span>
                      <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>

                  {/* Add Category Button */}
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center gap-2 sm:gap-3 transition-colors font-medium text-sm flex-1 sm:flex-none"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Tambah Kategori</span>
                    <span className="sm:hidden">Tambah</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Table */}
          <div className="p-4 sm:p-6">
            {/* Mobile Card View */}
            <div className="block lg:hidden space-y-4">
              {filteredCategories.map((cat) => (
                <div key={cat.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm truncate">{cat.name}</h3>
                      <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                        {cat.description || "Tidak ada deskripsi"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <button
                        className="p-2 text-orange-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredCategories.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg font-medium">Tidak ada kategori ditemukan</p>
                  <p className="text-sm mt-1">Coba ubah kata kunci pencarian Anda</p>
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                      NAMA
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                      DESKRIPSI
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                      TINDAKAN
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((cat, index) => (
                    <tr
                      key={cat.id}
                      className={`hover:bg-gray-100 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                    >
                      <td className="py-5 px-6">
                        <div className="font-medium text-gray-900 text-sm">{cat.name}</div>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-gray-600 text-sm">{cat.description}</span>
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

                  {filteredCategories.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-12 px-6 text-center bg-white">
                        <div className="text-gray-500">
                          <p className="text-lg font-medium">Tidak ada kategori ditemukan</p>
                          <p className="text-sm mt-1">Coba ubah kata kunci pencarian Anda</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add Category Modal */}
        {showAddModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 rounded-t-xl">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">
                  Tambah Kategori
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 sm:p-6">
                {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}

                <div className="space-y-6">
                  <div className="text-left">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Isi nama kategori
                    </h3>

                    {/* Category Name Input */}
                    <div className="relative mb-6">
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg 
                   focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-900"
                          placeholder="Rumah Tangga"
                        />
                        <label
                          htmlFor="name"
                          className="absolute left-4 top-1.5 text-sm text-green-600 transition-all 
                   peer-focus:text-green-600"
                        >
                          Kategori
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 py-3 px-6 text-[#26A81D] bg-[#E6FCF6] rounded-lg 
               hover:bg-green-100 transition-colors font-medium"
                    >
                      Kembali
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 py-3 px-6 bg-[#26A81D] text-white rounded-lg 
               hover:bg-green-700 transition-colors font-medium 
               disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Menyimpan..." : "Konfirmasi"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Filter Dropdown */}
        {showFilter && (
          <div className="fixed inset-0 z-40" onClick={() => setShowFilter(false)}>
            <div
              className="absolute top-32 right-4 sm:right-8 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-64 max-w-[calc(100vw-2rem)]"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-medium text-gray-900 mb-3">Filter Kategori</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Deskripsi</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none focus:border-transparent"
                    value={filterOption}
                    onChange={(e) => setFilterOption(e.target.value)}
                  >
                    <option>Semua</option>
                    <option>Dengan Deskripsi</option>
                    <option>Tanpa Deskripsi</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    onClick={() => setShowFilter(false)}
                  >
                    Terapkan
                  </button>
                  <button
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    onClick={() => {
                      setFilterOption("Semua");
                      setShowFilter(false);
                    }}
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

export default Categories;