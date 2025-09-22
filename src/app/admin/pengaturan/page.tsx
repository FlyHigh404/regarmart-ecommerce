"use client"
import { useState } from "react"
import AdminLayout from "../AdminLayout"
import { Edit, Eye, EyeOff, Upload, RotateCcw } from "lucide-react"

const Pengaturan = () => {
    const [activeTab, setActiveTab] = useState("kelola-akun")
    const [showPassword, setShowPassword] = useState(false)
    const [selectedTheme, setSelectedTheme] = useState("light")
    const [fontSize, setFontSize] = useState(5)
    const [selectedFont, setSelectedFont] = useState("Open Sans")

    const [formData, setFormData] = useState({
        name: "Admin",
        email: "email@regarmart.com",
        password: "••••••••",
    })

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const resetSettings = () => {
        setSelectedTheme("light")
        setFontSize(5)
        setSelectedFont("Open Sans")
    }

    return (
        <AdminLayout>
            <main className="flex-1 bg-gray-50 pt-6">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200">
                        <div className="flex justify-center gap-52">
                            <button
                                onClick={() => setActiveTab("kelola-akun")}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "kelola-akun"
                                        ? "text-green-600 border-green-600"
                                        : "text-gray-500 border-transparent hover:text-gray-700"
                                    }`}
                            >
                                Kelola akun
                            </button>
                            <button
                                onClick={() => setActiveTab("pengaturan-dashboard")}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "pengaturan-dashboard"
                                        ? "text-green-600 border-green-600"
                                        : "text-gray-500 border-transparent hover:text-gray-700"
                                    }`}
                            >
                                Pengaturan dashboard
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === "kelola-akun" && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Profile Picture Section */}
                                <div className="lg:col-span-1">
                                    <div className="bg-green-50 rounded-xl p-6 text-center">
                                        <div className="w-48 h-48 mx-auto mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                                            <img src="/colorful-vegetables-and-food-illustration.jpg" alt="Profile" className="w-full h-full object-cover" />
                                        </div>
                                        <button className="bg-white text-green-600 px-6 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors border border-green-200 flex items-center gap-2 mx-auto">
                                            <Upload size={16} />
                                            Pilih Foto
                                        </button>
                                        <div className="mt-3 text-sm text-gray-500">
                                            <p>Ukuran gambar: maks. 1 MB</p>
                                            <p>Format gambar: .JPEG, .PNG</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Section */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange("name", e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-green-500 focus:outline-none focus:border-transparent"
                                            />
                                            <Edit className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange("email", e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-green-500 focus:outline-none focus:border-transparent"
                                            />
                                            <Edit className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                        <div className="flex gap-3">
                                            <div className="relative flex-1">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={formData.password}
                                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-green-500 focus:outline-none focus:border-transparent"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                            <button className="bg-green-100 text-green-600 px-4 py-3 rounded-lg font-medium hover:bg-green-200 transition-colors">
                                                Ubah
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
                                            Simpan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "pengaturan-dashboard" && (
                            <div className="space-y-8">
                                {/* Theme Section */}
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Tema</h3>
                                    <div className="grid grid-cols-2 gap-4 max-w-xl">
                                        <button
                                            onClick={() => setSelectedTheme("light")}
                                            className={`p-4 rounded-2xl border-2 transition-all ${selectedTheme === "light"
                                                    ? "border-green-500 bg-white"
                                                    : "border-gray-200 hover:border-gray-300 bg-white"
                                                }`}
                                        >
                                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                                <div className="flex gap-1 mb-3">
                                                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <div className="w-6 h-8 bg-gray-200 rounded"></div>
                                                    <div className="flex-1 space-y-1">
                                                        <div className="h-1.5 bg-gray-200 rounded"></div>
                                                        <div className="h-1.5 bg-gray-200 rounded w-3/4"></div>
                                                        <div className="h-1.5 bg-gray-200 rounded w-1/2"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => setSelectedTheme("dark")}
                                            className={`p-4 rounded-2xl border-2 transition-all ${selectedTheme === "dark"
                                                    ? "border-green-500 bg-white"
                                                    : "border-gray-200 hover:border-gray-300 bg-white"
                                                }`}
                                        >
                                            <div className="bg-gray-800 rounded-xl p-4 shadow-sm">
                                                <div className="flex gap-1 mb-3">
                                                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                                                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                                                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <div className="w-6 h-8 bg-gray-600 rounded"></div>
                                                    <div className="flex-1 space-y-1">
                                                        <div className="h-1.5 bg-gray-600 rounded"></div>
                                                        <div className="h-1.5 bg-gray-600 rounded w-3/4"></div>
                                                        <div className="h-1.5 bg-gray-600 rounded w-1/2"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* Other Settings */}
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-8">Lainnya</h3>

                                    <div className="space-y-8 max-w-2xl">
                                        {/* Font Size */}
                                        <div>
                                            <div className="flex justify-between items-center mb-4">
                                                <label className="text-base font-medium text-gray-700">Font Size</label>
                                                <span className="text-base text-gray-600 font-medium">{fontSize}</span>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max="10"
                                                    value={fontSize}
                                                    onChange={(e) => setFontSize(Number(e.target.value))}
                                                    className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                                                    style={{
                                                        background: `linear-gradient(to right, #10b981 0%, #10b981 ${(fontSize - 1) * (100 / 9)}%, #e5e7eb ${(fontSize - 1) * (100 / 9)}%, #e5e7eb 100%)`
                                                    }}
                                                />
                                                <div
                                                    className="absolute top-1/2 transform -translate-y-1/2 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-lg pointer-events-none"
                                                    style={{ left: `calc(${(fontSize - 1) * (100 / 9)}% - 10px)` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Reset Button */}
                                        <div>
                                            <button
                                                onClick={resetSettings}
                                                className="bg-green-50 text-green-600 px-6 py-3 rounded-xl font-medium hover:bg-green-100 transition-colors flex items-center gap-2 border border-green-200"
                                            >
                                                <RotateCcw size={18} />
                                                Reset
                                            </button>
                                        </div>

                                        {/* Font Selection */}
                                        <div>
                                            <label className="block text-base font-medium text-gray-700 mb-3">Font</label>
                                            <div className="relative">
                                                <select
                                                    value={selectedFont}
                                                    onChange={(e) => setSelectedFont(e.target.value)}
                                                    className="w-full border-2 border-green-500 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none appearance-none text-base font-medium text-gray-700"
                                                >
                                                    <option value="Open Sans">Open Sans</option>
                                                    <option value="Inter">Inter</option>
                                                    <option value="Roboto">Roboto</option>
                                                    <option value="Poppins">Poppins</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Sample Text */}
                                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                            <p className="text-gray-700 text-base leading-relaxed" style={{ fontFamily: selectedFont, fontSize: `${0.75 + (fontSize * 0.125)}rem` }}>
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                                                the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                                                galley...
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </AdminLayout>
    )
}

export default Pengaturan
