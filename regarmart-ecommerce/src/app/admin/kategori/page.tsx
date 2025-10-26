// components/Categories.tsx
"use client";
import { useState, useEffect } from "react";
import AdminLayout from "../AdminLayout";
import { Search, Plus, Edit, Trash2, X, Filter, ChevronDown, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import CategoryUploadForm from "@/components/CategoryUploadForm";

// Add this type definition at the top of your file
type Toast = {
  id: number;
  type: "success" | "error";
  message: string;
};

interface CategoryUploadFormProps {
  initialData?: any;
  onClose?: () => void;
  onSuccess?: () => void;
}

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string; description: string; imageUrl: string | null }>
  >([]);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string; description: string } | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Delete success modal states
  const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false);
  const [deletedCategoryName, setDeletedCategoryName] = useState("");

  // Add this toast function
  const showToast = (type: "success" | "error", message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // filter states
  const [filterOption, setFilterOption] = useState("Semua");

  const refreshCategories = async () => {
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
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

  const handleDeleteClick = (category: { id: string; name: string; description: string }) => {
    setCategoryToDelete({
      id: category.id,
      name: category.name,
      description: category.description
    });
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(categoryToDelete.id);
    setDeleteConfirmOpen(false);

    try {
      const response = await fetch(`/api/admin/categories/${categoryToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      // Store deleted category name for success modal
      setDeletedCategoryName(categoryToDelete.name);

      await refreshCategories();
      
      // Show success modal instead of toast
      setDeleteSuccessOpen(true);
    } catch (error) {
      console.error("Error deleting category:", error);
      showToast("error", "Gagal menghapus kategori. Silakan coba lagi.");
    } finally {
      setIsDeleting(null);
      setCategoryToDelete(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <main className="flex-1 bg-gray-50 pt-3">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden p-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-600">Loading categories...</p>
            </div>
          </div>
        </main>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-[100] space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg animate-slide-in ${
              toast.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        ))}
      </div>

      <main className="flex-1 bg-gray-50 pt-3">
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
                {/* Filter and Add buttons container */}
                <div className="flex space-x-2 sm:space-x-3 order-2 sm:order-2">
                  {/* Add Category Button */}
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center gap-2 sm:gap-3 transition-colors font-medium text-sm flex-1 sm:flex-none mr-3"
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
                <div
                  key={cat.id}
                  className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
                    isDeleting === cat.id ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm truncate">{cat.name}</h3>
                      <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                        {cat.description || "Tidak ada deskripsi"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <button
                        onClick={() => {
                          setEditingCategory(cat);
                          setShowEditModal(true);
                        }}
                        className="p-2 text-orange-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
                        title="Edit"
                        disabled={isDeleting === cat.id}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(cat)}
                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                        title="Delete"
                        disabled={isDeleting === cat.id}
                      >
                        {isDeleting === cat.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
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
                      className={`hover:bg-gray-100 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } ${isDeleting === cat.id ? "opacity-50" : ""}`}
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
                            onClick={() => {
                              setEditingCategory(cat);
                              setShowEditModal(true);
                            }}
                            className="p-2 text-orange-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
                            title="Edit"
                            disabled={isDeleting === cat.id}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(cat)}
                            className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                            title="Delete"
                            disabled={isDeleting === cat.id}
                          >
                            {isDeleting === cat.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
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

        {/* Delete Confirmation Modal */}
        {deleteConfirmOpen && categoryToDelete && (
          <div className="fixed inset-0 bg-transparent backdrop-blur-md flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[440px] p-6 md:p-8 relative animate-scale-in">
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-red-600" />
                </div>

                {/* Title */}
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                  Hapus Kategori?
                </h2>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-600 mb-2">
                  Apakah Anda yakin ingin menghapus kategori ini?
                </p>

                {/* Category Preview */}
                <div className="w-full bg-gray-50 rounded-lg p-3 mb-6 text-left">
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    {categoryToDelete.name}
                  </p>
                  <p className="text-xs text-gray-600 mb-1">
                    {categoryToDelete.description || "Tidak ada deskripsi"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Kategori ini akan dihapus secara permanen
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 w-full">
                  <button
                    className="flex-1 px-4 py-2.5 md:py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-sm md:text-base"
                    onClick={() => {
                      setDeleteConfirmOpen(false);
                      setCategoryToDelete(null);
                    }}
                  >
                    Batal
                  </button>
                  <button
                    className="flex-1 px-4 py-2.5 md:py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors text-sm md:text-base"
                    onClick={handleDeleteConfirm}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Success Modal */}
        {deleteSuccessOpen && (
          <div className="fixed inset-0 bg-transparent backdrop-blur-md flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[440px] p-6 md:p-8 relative animate-scale-in">
              <div className="flex flex-col items-center text-center">
                {/* Success Icon */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
                </div>

                {/* Title */}
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                  Kategori Berhasil Dihapus!
                </h2>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-600 mb-4">
                  Kategori <span className="font-semibold text-gray-900">{deletedCategoryName}</span> telah dihapus dari sistem
                </p>

                {/* OK Button */}
                <button
                  className="w-full px-4 py-2.5 md:py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors text-sm md:text-base"
                  onClick={() => setDeleteSuccessOpen(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

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
                <CategoryUploadForm
                  onClose={() => setShowAddModal(false)}
                  onSuccess={refreshCategories}
                />
              </div>
            </div>
          </div>
        )}

        {/* Edit Category Modal */}
        {showEditModal && editingCategory && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowEditModal(false)}
            />
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 rounded-t-xl">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 text-center">
                  Edit Kategori
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 sm:p-6">
                <CategoryUploadForm
                  initialData={editingCategory}
                  onClose={() => setShowEditModal(false)}
                  onSuccess={refreshCategories}
                />
              </div>
            </div>
          </div>
        )}

        {/* Filter Dropdown */}
        {showFilter && (
          <div className="fixed inset-0 z-40 flex items-center justify-center" onClick={() => setShowFilter(false)}>
            <div
              className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filter Kategori</h3>
                <button
                  onClick={() => setShowFilter(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none focus:border-transparent"
                    value={filterOption}
                    onChange={(e) => setFilterOption(e.target.value)}
                  >
                    <option>Semua</option>
                    <option>Dengan Deskripsi</option>
                    <option>Tanpa Deskripsi</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    onClick={() => setShowFilter(false)}
                  >
                    Terapkan
                  </button>
                  <button
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
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

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </AdminLayout>
  );
};

export default Categories;