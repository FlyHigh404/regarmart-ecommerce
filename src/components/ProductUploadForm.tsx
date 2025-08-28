// components/ProductUploadForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, Edit, DollarSign, Package } from "lucide-react";
import FileDropzone from "./FileDropZone";

interface Category {
  id: string;
  name: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
  imageUrls: string[];
}

export default function ProductUploadForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    imageUrls: [],
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/products/categories");
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilesDrop = async (files: FileList) => {
    setUploadingImages(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          uploadedUrls.push(data.url);
        } else {
          const errorData = await response.json();
          console.error("Upload failed:", errorData.error);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    setFormData((prev) => ({
      ...prev,
      imageUrls: [...prev.imageUrls, ...uploadedUrls],
    }));
    setUploadingImages(false);
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        alert("Product created successfully!");
        router.push("/admin/produk");
        // Reset form
        setFormData({
          name: "",
          description: "",
          price: "",
          stock: "",
          categoryId: "",
          imageUrls: [],
        });
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tambah Produk</h2>
        <h3 className="text-lg font-medium text-gray-700 mb-6">
          Isi detail produk
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div className="mb-8">
          {formData.imageUrls.length > 0 ? (
            <div className="relative">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                <img
                  src={formData.imageUrls[0]}
                  alt="Product preview"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Additional images thumbnails */}
              {formData.imageUrls.length > 1 && (
                <div className="flex gap-2 mt-3">
                  {formData.imageUrls.slice(1).map((url, index) => (
                    <div key={index + 1} className="relative group">
                      <img
                        src={url}
                        alt={`Product image ${index + 2}`}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index + 1)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {/* Replace/Remove main image button */}
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => removeImage(0)}
                  className="bg-white/90 backdrop-blur-sm text-gray-700 rounded-full p-2 hover:bg-white shadow-sm"
                  title="Hapus gambar"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <FileDropzone
              onFilesDrop={handleFilesDrop}
              accept="image/*"
              multiple={true}
              label="Klik untuk upload gambar atau drag & drop di sini"
              id="product-images-upload"
            />
          )}

          {uploadingImages && (
            <div className="mt-3 flex items-center justify-center text-sm text-gray-600">
              <Loader2 className="animate-spin mr-2" size={16} />
              Mengupload gambar...
            </div>
          )}
        </div>

        {/* Product Name */}
        <div className="relative">
          <label className="block text-sm font-medium text-green-600 mb-2">
            Nama produk
          </label>
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
              placeholder="Masukkan nama produk"
            />
            <Edit
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </div>

        {/* Category */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Kategori
          </label>
          <div className="relative">
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 appearance-none bg-white"
            >
              <option value="">Pilih kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>

        {/* Price */}
        <div className="relative">
          <label className="block text-sm font-medium text-green-600 mb-2">
            Harga
          </label>
          <div className="relative">
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
              placeholder="Rp"
            />
            <DollarSign
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </div>

        {/* Stock */}
        <div className="relative">
          <label className="block text-sm font-medium text-green-600 mb-2">
            Stok
          </label>
          <div className="relative">
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              required
              min="0"
              className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
              placeholder="0"
            />
            <Package
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-8">
          <button
            type="submit"
            disabled={loading || formData.imageUrls.length === 0}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg font-medium text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Menyimpan...
              </>
            ) : (
              "Konfirmasi"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
