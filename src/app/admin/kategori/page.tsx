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
      <main className="flex-1 p-8 bg-gray-50">
        {/* Main Container with shadow and rounded corners */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header Section */}
          <div className="px-6 pt-6 pb-3 bg-white">
            <div className="flex justify-between items-center">
              {/* Header Text */}
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-gray-900">Tabel Kategori</h1>
                <p className="text-gray-500 text-base mt-1">Ini adalah daftar kategori produk</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Cari kategori..."
                    className="pl-12 pr-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none focus:border-transparent w-80 bg-white text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Filter Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg flex items-center gap-3 transition-colors text-sm"
                  >
                    <Filter size={18} className="text-green-600" />
                    Filter
                    <ChevronDown size={16} />
                  </button>
                </div>

                {/* Add Category Button */}
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-3 transition-colors font-medium text-sm"
                >
                  <Plus size={18} />
                  Tambah Kategori
                </button>
              </div>
            </div>
          </div>

          {/* Categories Table */}
          <div className="p-6">
            <div className="overflow-x-auto rounded-lg">
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
                      className={`hover:bg-gray-100 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
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
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
                <h2 className="text-xl font-semibold text-gray-900 text-center">
                  Tambah Kategori
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nama Kategori
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:outline-none focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Deskripsi
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:outline-none focus:border-transparent"
                      rows={3}
                      placeholder="Opsional: Masukkan deskripsi kategori"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 w-full py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Menyimpan..." : "Simpan Kategori"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Filter Dropdown */}
        {showFilter && (
          <div className="fixed inset-0 z-40" onClick={() => setShowFilter(false)}>
            <div
              className="absolute top-32 right-8 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-64"
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