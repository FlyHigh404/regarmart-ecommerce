// components/CategoryUploadForm.tsx
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2 } from "lucide-react";
import FileDropzone from "./FileDropZone";

interface Category {
    id: string;
    name: string;
}

interface CategoryFormData {
    name: string;
    description: string;
    imageUrl: string | null; // Single image URL
}

interface CategoryUploadFormProps {
    initialData?: any; // data kategori untuk edit
    onClose?: () => void;
}

export default function CategoryUploadForm({ initialData, onClose }: CategoryUploadFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState<CategoryFormData>({
        name: "",
        description: "",
        imageUrl: null, // Single image URL
    });

    const [pendingFile, setPendingFile] = useState<File | null>(null); // Store a single file
    const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Single preview URL

    // Fetch categories (similar to how products were fetched)
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

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                description: initialData.description || "",
                imageUrl: initialData.imageUrl || null, // Ensure existing image is handled correctly
            });

            setPreviewUrl(initialData.imageUrl || null); // Show the initial image preview
        }
    }, [initialData]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle file drop (preview first, not uploaded yet)
    const handleFilesDrop = (files: FileList) => {
        const file = files[0]; // Get the first file only
        setPendingFile(file);
        const newPreview = URL.createObjectURL(file); // Set preview for the first image only
        setPreviewUrl(newPreview);
    };

    const removeImage = () => {
        setPendingFile(null); // Clear the file
        setPreviewUrl(null);  // Clear the preview
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Upload the image if present
            let uploadedUrl: string | null = formData.imageUrl;

            if (pendingFile) {
                const fd = new FormData();
                fd.append("file", pendingFile);

                const res = await fetch("/api/upload", { method: "POST", body: fd });
                if (!res.ok) throw new Error("Upload failed");
                const data = await res.json();
                uploadedUrl = data.url; // Get the uploaded image URL
            }

            // Category data to send
            const categoryData = {
                ...formData,
                imageUrl: uploadedUrl || formData.imageUrl, // Use uploaded URL or existing image URL
            };

            let response;
            if (initialData) {
                // Update category if initialData exists
                response = await fetch(`/api/admin/categories/${initialData.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(categoryData),
                });
            } else {
                // Create new category if no initialData
                response = await fetch("/api/admin/categories", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(categoryData),
                });
            }

            if (response.ok) {
                window.location.reload(); // Reload page after saving
            } else {
                const errorData = await response.json();
                alert(errorData.error || "Failed to save category");
            }
        } catch (err: any) {
            console.error(err);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="text-left mb-8">
                <h3 className="text-lg font-medium text-gray-700 mb-6">Isi detail kategori</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload Section */}
                <div className="mb-8">
                    {previewUrl ? (
                        <div>
                            <div className="relative">
                                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                                    <img
                                        src={previewUrl}
                                        alt="Category preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="absolute top-3 right-3 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="bg-white/90 backdrop-blur-sm text-gray-700 rounded-full p-2 hover:bg-white shadow-sm"
                                        title="Hapus gambar"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Upload additional images section */}
                            <div className="mt-4">
                                <div className="relative border-2 border-dashed border-green-400 rounded-lg p-6 bg-white hover:bg-green-50 transition-colors">
                                    <div className="text-center">
                                        <div className="w-12 h-12 mx-auto mb-3 text-green-500">
                                            <img src="/export.png" alt="Upload Icon" />
                                        </div>
                                        <p className="text-gray-700 font-medium">Tambah gambar lain (klik/drag disini)</p>
                                    </div>
                                    <FileDropzone
                                        onFilesDrop={handleFilesDrop}
                                        accept="image/*"
                                        multiple={false} // Only one image allowed
                                        label="Tambah gambar kategori"
                                        id="category-images-initial"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="relative border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                            <div className="py-12 text-center">
                                <img src="/export.png" className="mx-auto w-16 h-16 text-gray-400 mb-4" />
                                <div className="space-y-2">
                                    <p className="text-lg font-medium text-gray-700">Upload gambar kategori</p>
                                    <p className="text-gray-500">Klik untuk memilih file atau drag & drop di sini</p>
                                    <p className="text-sm text-gray-400">Mendukung format: JPEG, JPG & PNG</p>
                                </div>
                            </div>
                            <FileDropzone
                                onFilesDrop={handleFilesDrop}
                                accept="image/*"
                                multiple={false} // Only one image allowed
                                label="Upload gambar kategori"
                                id="category-images-initial"
                            />
                        </div>
                    )}
                </div>

                {/* Category Name */}
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
                            placeholder="Nama Kategori"
                        />
                        <label
                            htmlFor="name"
                            className="absolute left-4 top-1.5 text-sm text-green-600 transition-all 
                peer-focus:text-green-600"
                        >
                            Nama kategori
                        </label>
                    </div>
                </div>

                {/* Description */}
                <div className="relative">
                    <div className="relative">
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            rows={4}
                            className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-900 resize-none"
                            placeholder="Deskripsi kategori"
                        />
                        <label
                            htmlFor="description"
                            className="absolute left-4 top-1.5 text-sm text-green-600 transition-all 
                peer-focus:text-green-600"
                        >
                            Deskripsi Kategori
                        </label>
                    </div>
                </div>

                {/* Submit */}
                <div className="pt-8">
                    <button
                        type="submit"
                        disabled={loading || !previewUrl}
                        className="w-full bg-[#26A81D] hover:bg-[#21961A] text-white py-4 px-6 rounded-lg font-medium text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
