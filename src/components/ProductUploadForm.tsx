// components/ProductUploadForm.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { X, Loader2 } from "lucide-react"
import FileDropzone from "./FileDropZone"

interface Category {
  id: string
  name: string
}

interface ProductFormData {
  name: string
  description: string
  price: string
  stock: string
  categoryId: string
  imageUrls: string[] // hasil upload ke server
}

export default function ProductUploadForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    imageUrls: [],
  })

  // tambahan
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/products/categories")
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }
    fetchCategories()
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // drop file (preview dulu, belum upload)
  const handleFilesDrop = (files: FileList) => {
    const arr = Array.from(files)
    setPendingFiles((prev) => [...prev, ...arr])
    const newPreviews = arr.map((f) => URL.createObjectURL(f))
    setPreviewUrls((prev) => [...prev, ...newPreviews])
  }

  const removeImage = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // upload semua pending files
      setUploadingImages(true)
      const uploadedUrls: string[] = []

      for (const file of pendingFiles) {
        const fd = new FormData()
        fd.append("file", file)

        const res = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || "Upload failed")
        }

        const data = await res.json()
        uploadedUrls.push(data.url)
      }
      setUploadingImages(false)

      // simpan produk
      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        stock: Number.parseInt(formData.stock),
        imageUrls: uploadedUrls,
      }

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        alert("Product created successfully!")
        router.push("/admin/produk")

        // reset form
        setFormData({
          name: "",
          description: "",
          price: "",
          stock: "",
          categoryId: "",
          imageUrls: [],
        })
        setPendingFiles([])
        setPreviewUrls([])
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.error}`)
      }
    } catch (error: any) {
      console.error("Error creating product:", error)
      alert(error.message || "Failed to create product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-left mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-6">Isi detail produk</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div className="mb-8">
          {previewUrls.length > 0 ? (
            <div>
              {/* Preview Gambar Utama */}
              <div className="relative">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                  <img
                    src={previewUrls[0]}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Thumbnail gambar tambahan */}
                {previewUrls.length > 1 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {previewUrls.slice(1).map((url, index) => (
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

                {/* Hapus gambar utama */}
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

              <div className="mt-4">
                <div className="relative border-2 border-dashed border-green-400 rounded-lg p-6 bg-white hover:bg-green-50 transition-colors">
                  <div className="text-center">
                    {/* Upload Icon hijau seperti dalam gambar */}
                    <div className="w-12 h-12 mx-auto mb-3 text-green-500">
                      <img src="/export.png" alt="" />
                    </div>
                    <p className="text-gray-700 font-medium">Tambah gambar lain (klik/drag disini)</p>
                  </div>
                  <FileDropzone
                    onFilesDrop={handleFilesDrop}
                    accept="image/*"
                    multiple={true}
                    label="Tambah gambar lain"
                    id="product-images-additional"

                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
              <div className="py-12 text-center">
                <img src="/export.png" className="mx-auto w-16 h-16 text-gray-400 mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-700">Upload gambar produk</p>
                  <p className="text-gray-500">Klik untuk memilih file atau drag & drop di sini</p>
                  <p className="text-sm text-gray-400">Mendukung format: JPEG, JPG & PNG</p>
                </div>
              </div>
              <FileDropzone
                onFilesDrop={handleFilesDrop}
                accept="image/*"
                multiple={true}
                label="Upload gambar produk"
                id="product-images-initial"
              />
            </div>
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
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg 
        focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-900"
              placeholder="Nama Produk"
            />
            <label
              htmlFor="name"
              className="absolute left-4 top-1.5 text-sm text-green-600 transition-all 
        peer-focus:text-green-600"
            >
              Nama produk
            </label>
          </div>
        </div>

        {/* Category */}
        <div className="relative">
          <div className="relative">
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              required
              className="peer w-full px-4 pt-3 pb-3 pr-12 border border-gray-300 rounded-lg 
        focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-500 bg-white appearance-none"
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
          <div className="relative">
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="peer w-full px-4 pt-6 pb-2 pr-12 border border-gray-300 rounded-lg 
        focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-900"
              placeholder="Rp"
            />
            <label
              htmlFor="price"
              className="absolute left-4 top-1.5 text-sm text-green-600 transition-all 
        peer-focus:text-green-600"
            >
              Harga
            </label>
            <img src="/dollar-circle.png" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Stock */}
        <div className="relative">
          <div className="relative">
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              required
              min="0"
              className="peer w-full px-4 pt-6 pb-2 pr-12 border border-gray-300 rounded-lg 
        focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-900"
              placeholder="0"
            />
            <label
              htmlFor="stock"
              className="absolute left-4 top-1.5 text-sm text-green-600 transition-all 
        peer-focus:text-green-600"
            >
              Stok
            </label>
            <img src="/box.png" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-8">
          <button
            type="submit"
            disabled={loading || previewUrls.length === 0}
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
  )
}
