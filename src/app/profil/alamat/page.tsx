"use client"
import { useState, useEffect } from "react";
import { Search, MapPin, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import AddAddress from "@/components/TambahAlamat";
import InputBox from "@/components/InputBox";

type Address = {
  id: string;
  recipientName: string;
  phoneNumber: string;
  label: string;
  fullAddress: string;
  note?: string;
  isPrimary: boolean;
};

type Toast = {
  id: number;
  type: "success" | "error";
  message: string;
};

export default function ProfileAddressPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [addressEdit, setAddressEdit] = useState<Address | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [addressList, setAddressList] = useState<Address[]>([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Delete confirmation modal
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/profile/address");
        if (!response.ok) {
          throw new Error("Failed to fetch addresses");
        }
        const data = await response.json();
        setAddressList(data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        showToast("error", "Gagal memuat daftar alamat. Silakan refresh halaman.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleDelete = async () => {
    if (!addressToDelete) return;

    setIsDeleting(addressToDelete.id);
    setDeleteConfirmOpen(false);

    try {
      const response = await fetch(`/api/profile/address/${addressToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete address");
      }

      setAddressList((prev) => prev.filter((a) => a.id !== addressToDelete.id));
      showToast("success", "Alamat berhasil dihapus");
    } catch (error) {
      console.error("Error deleting address:", error);
      showToast("error", "Gagal menghapus alamat. Silakan coba lagi.");
    } finally {
      setIsDeleting(null);
      setAddressToDelete(null);
    }
  };

  const handleSaveEdit = async () => {
    if (!addressEdit) return;

    // Validasi
    if (!addressEdit.recipientName.trim()) {
      showToast("error", "Nama penerima tidak boleh kosong");
      return;
    }
    if (!addressEdit.phoneNumber.trim()) {
      showToast("error", "Nomor telepon tidak boleh kosong");
      return;
    }
    if (!addressEdit.fullAddress.trim()) {
      showToast("error", "Alamat lengkap tidak boleh kosong");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/profile/address/${addressEdit.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: addressEdit.label,
          fullAddress: addressEdit.fullAddress,
          recipientName: addressEdit.recipientName,
          phoneNumber: addressEdit.phoneNumber,
          note: addressEdit.note,
          isPrimary: addressEdit.isPrimary,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update address");
      }

      const updatedAddress: Address = await response.json();

      setAddressList((prev) =>
        prev.map((a) => (a.id === updatedAddress.id ? updatedAddress : a))
      );

      setEditOpen(false);
      setAddressEdit(null);
      showToast("success", "Alamat berhasil diperbarui");
    } catch (error) {
      console.error("Error updating address:", error);
      showToast("error", "Gagal memperbarui alamat. Silakan coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };


  const filteredAddresses = addressList.filter((item) =>
    item.fullAddress.toLowerCase().includes(search.toLowerCase()) ||
    item.recipientName.toLowerCase().includes(search.toLowerCase()) ||
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-[100] space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg animate-slide-in ${toast.type === "success"
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

      <div
        className="w-full max-w-[756.65px] rounded-[15px] bg-white p-4 md:p-8 font-jakarta"
        style={{ boxShadow: "6px 6px 54px 0 rgba(0, 0, 0, 0.05)" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 md:mb-6 -mt-8 md:-mt-16">
          <h1 className="text-black font-bold text-xl md:text-2xl mt-6 md:mt-12">
            Alamat
          </h1>
        </div>

        {/* Search + Add */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center mb-4 md:mb-6 gap-3 md:gap-0">
          <div className="relative w-full md:w-87">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, alamat, atau label..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#26A81D]"
              disabled={isLoading}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          </div>
          <button
            className="px-4 py-2 rounded-xl w-full md:w-50 h-10 bg-green-500 text-white font-semibold hover:bg-green-700 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={() => setAddOpen(true)}
            disabled={isLoading}
          >
            + Tambah
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-green-600 animate-spin mb-3" />
            <p className="text-gray-500 text-sm">Memuat daftar alamat...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && addressList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MapPin className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Belum Ada Alamat
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Tambahkan alamat pengiriman Anda untuk memudahkan checkout
            </p>
            <button
              className="px-6 py-2 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-700 transition-colors"
              onClick={() => setAddOpen(true)}
            >
              + Tambah Alamat Pertama
            </button>
          </div>
        )}

        {/* No Search Results */}
        {!isLoading && addressList.length > 0 && filteredAddresses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Alamat Tidak Ditemukan
            </h3>
            <p className="text-gray-500 text-sm">
              Tidak ada alamat yang cocok dengan pencarian "{search}"
            </p>
          </div>
        )}

        {/* Address List */}
        {!isLoading && filteredAddresses.length > 0 && (
          <div className="space-y-3 md:space-y-4">
            {filteredAddresses.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelected(item.id)}
                className={`bg-white shadow rounded-xl p-3 md:p-4 cursor-pointer transition border ${selected === item.id
                  ? "border-green-500 shadow-[0_0_16px_rgba(38,168,29,0.32)]"
                  : "border-gray-200"
                  } ${isDeleting === item.id ? "opacity-50" : ""}`}
              >
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                    <p className="font-medium text-[14px] md:text-[15px] font-jakarta text-[#8F8F8F]">
                      {item.label || "No Label"}
                    </p>
                    {item.isPrimary && (
                      <span className="bg-green-100 text-green-600 text-xs font-medium px-2 md:px-2.5 py-0.5 rounded-full">
                        Utama
                      </span>
                    )}
                  </div>
                </div>

                <div className="pl-6 md:pl-8 mt-2">
                  <p className="font-medium text-xs md:text-sm font-jakarta text-black">
                    {item.recipientName}
                    <span className="after:content-['|'] after:mx-2 text-[#8F8F8F]"></span>
                    <span className="font-medium text-[13px] md:text-[14px] font-jakarta text-[#8F8F8F]">
                      {item.phoneNumber}
                    </span>
                  </p>
                  <p className="font-normal text-[12px] md:text-[13px] font-jakarta text-[#8F8F8F] leading-relaxed">
                    {item.fullAddress}
                  </p>

                  {item.note && (
                    <p className="text-[12px] md:text-[13px] text-gray-500 italic">
                      Catatan: {item.note}
                    </p>
                  )}

                  <div className="flex gap-2 mt-2 text-xs md:text-sm">
                    <button
                      className="text-green-600 hover:text-green-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAddressEdit(item);
                        setEditOpen(true);
                      }}
                      disabled={isDeleting === item.id}
                    >
                      Ubah
                    </button>
                    <span className="text-gray-400">|</span>
                    <button
                      className="text-gray-500 hover:text-red-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAddressToDelete(item);
                        setDeleteConfirmOpen(true);
                      }}
                      disabled={isDeleting === item.id}
                    >
                      {isDeleting === item.id ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Menghapus...
                        </>
                      ) : (
                        "Hapus"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmOpen && addressToDelete && (
          <div className="fixed inset-0 bg-transparent backdrop-blur-md flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[440px] p-6 md:p-8 relative animate-scale-in">
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-red-600" />
                </div>

                {/* Title */}
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                  Hapus Alamat?
                </h2>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-600 mb-2">
                  Apakah Anda yakin ingin menghapus alamat ini?
                </p>

                {/* Address Preview */}
                <div className="w-full bg-gray-50 rounded-lg p-3 mb-6 text-left">
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    {addressToDelete.label}
                    {addressToDelete.isPrimary && (
                      <span className="ml-2 bg-green-100 text-green-600 text-xs font-medium px-2 py-0.5 rounded-full">
                        Utama
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-600">
                    {addressToDelete.recipientName} • {addressToDelete.phoneNumber}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {addressToDelete.fullAddress}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 w-full">
                  <button
                    className="flex-1 px-4 py-2.5 md:py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-sm md:text-base"
                    onClick={() => {
                      setDeleteConfirmOpen(false);
                      setAddressToDelete(null);
                    }}
                  >
                    Batal
                  </button>
                  <button
                    className="flex-1 px-4 py-2.5 md:py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors text-sm md:text-base"
                    onClick={handleDelete}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Address Modal */}
        <AddAddress
          isOpen={addOpen}
          onClose={() => setAddOpen(false)}
          onSave={(newAddress: Address) => {
            setAddressList([...addressList, newAddress]);
            showToast("success", "Alamat baru berhasil ditambahkan");
          }}
        />

        {/* Edit Address Modal */}
        {editOpen && addressEdit && (
          <div className="fixed inset-0 bg-transparent backdrop-blur-md flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-[600px] max-h-[90vh] overflow-y-auto p-4 md:p-6 relative">
              <button
                className="absolute top-3 md:top-4 right-3 md:right-4 text-gray-500 hover:text-gray-800 text-xl disabled:opacity-50"
                onClick={() => setEditOpen(false)}
                disabled={isSaving}
              >
                <X size={20} />
              </button>

              <h2 className="text-base md:text-lg font-bold text-black mb-3 md:mb-4 text-center pr-8">
                Edit Address
              </h2>
              <hr className="border-gray-200 my-3" />

              <div className="space-y-3 md:space-y-4">
                <InputBox
                  label="Address Label"
                  value={addressEdit.label || ""}
                  onChange={(e) =>
                    setAddressEdit({ ...addressEdit, label: e.target.value })
                  }
                  placeholder="e.g. Home, Office"
                  disabled={isSaving}
                />

                <InputBox
                  label="Full Address"
                  value={addressEdit.fullAddress}
                  onChange={(e) =>
                    setAddressEdit({
                      ...addressEdit,
                      fullAddress: e.target.value,
                    })
                  }
                  placeholder="Enter full address"
                  disabled={isSaving}
                />

                <InputBox
                  label="Note for Courier (Optional)"
                  value={addressEdit.note || ""}
                  onChange={(e) =>
                    setAddressEdit({ ...addressEdit, note: e.target.value })
                  }
                  placeholder="e.g. House color, landmarks"
                  disabled={isSaving}
                />

                <InputBox
                  label="Recipient Name"
                  value={addressEdit.recipientName}
                  onChange={(e) =>
                    setAddressEdit({
                      ...addressEdit,
                      recipientName: e.target.value,
                    })
                  }
                  placeholder="Full name"
                  disabled={isSaving}
                />

                <InputBox
                  label="Phone Number"
                  value={addressEdit.phoneNumber}
                  onChange={(e) =>
                    setAddressEdit({
                      ...addressEdit,
                      phoneNumber: e.target.value,
                    })
                  }
                  placeholder="08xxxxxxxxxx"
                  disabled={isSaving}
                />
              </div>

              <div className="mt-4 md:mt-6 flex justify-center">
                <button
                  className="w-full bg-green-600 text-white px-6 md:px-10 py-2.5 md:py-3 rounded-xl font-semibold hover:bg-green-700 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

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
    </>
  );
}