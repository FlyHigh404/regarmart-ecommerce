"use client";

import { useState, useEffect } from "react";
import { Trash2, Minus, Plus, CheckCircle, XCircle, X } from "lucide-react";
import Footer from "@/components/Footer";
import NavKeranjang from "@/components/NavKeranjang";

// Toast Notification Component
interface ToastProps {
  type: 'success' | 'error';
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Toast = ({ type, message, isVisible, onClose }: ToastProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // Auto close after 4 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-in slide-in-from-top-2">
      <div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-sm
          ${type === 'success' 
            ? 'bg-green-50/95 border-green-200 text-green-800' 
            : 'bg-red-50/95 border-red-200 text-red-800'
          }
          min-w-[320px] max-w-[400px]
        `}
      >
        <div className="flex-shrink-0">
          {type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600" />
          )}
        </div>
        
        <div className="flex-1 text-sm font-medium">
          {message}
        </div>
        
        <button
          onClick={onClose}
          className={`
            flex-shrink-0 p-1 rounded-full transition-colors
            ${type === 'success' 
              ? 'hover:bg-green-100 text-green-600' 
              : 'hover:bg-red-100 text-red-600'
            }
          `}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

interface CartItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  quantity: number;
  image: string;
  selected: boolean;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingItems, setDeletingItems] = useState<string[]>([]);
  const [updatingItems, setUpdatingItems] = useState<string[]>([]);

  // Toast state
  const [toast, setToast] = useState({
    isVisible: false,
    type: 'success' as 'success' | 'error',
    message: ''
  });

  // Show toast function
  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({
      isVisible: true,
      type,
      message
    });
  };

  // Hide toast function
  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  useEffect(() => {
    // Fungsi untuk mengambil data keranjang
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/cart");
        const data = await response.json();

        if (response.ok) {
          // Mengupdate cartItems dengan data yang diterima dari API
          const orderItems = data.orderItems || [];
          const formattedItems = orderItems.map((item: any) => ({
            id: item.id,
            name: item.product.name,
            price: parseFloat(item.unitPrice),
            stock: item.product.stock,
            quantity: item.quantity,
            image: item.product.imageUrl[0] || "/placeholder.svg", // Gambar produk
            selected: true, // Misalkan semua produk dipilih secara default
          }));
          setCartItems(formattedItems);
        } else {
          setError("Gagal memuat keranjang");
          showToast('error', 'Gagal memuat keranjang');
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        setError("Gagal memuat keranjang");
        showToast('error', 'Terjadi kesalahan saat memuat keranjang');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  if (loading) {
    return (
      <>
        <NavKeranjang />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat keranjang...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error && cartItems.length === 0) {
    return (
      <>
        <NavKeranjang />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-500 text-lg font-medium mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Coba Lagi
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const selectedItems = cartItems.filter((item) => item.selected);
  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = 4500;
  const shippingEstimate = 22500;
  const finalTotal = totalPrice - discount + shippingEstimate;

  const handleSelectAll = (checked: boolean) => {
    setCartItems((items) => items.map((item) => ({ ...item, selected: checked })));
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    setCartItems((items) =>
      items.map((item) => (item.id === id ? { ...item, selected: checked } : item))
    );
  };

  const handleQuantityChange = async (id: string, change: number) => {
    const item = cartItems.find(item => item.id === id);
    if (!item) return;

    const newQuantity = Math.max(1, Math.min(item.stock, item.quantity + change));
    
    if (newQuantity === item.quantity) return;

    setUpdatingItems(prev => [...prev, id]);

    try {
      const response = await fetch(`/api/cart/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: newQuantity,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Gagal memperbarui jumlah produk");
      }

      // Update state jika berhasil
      setCartItems((items) =>
        items.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
      );

      showToast('success', `Jumlah ${item.name} berhasil diperbarui`);
    } catch (error: any) {
      console.error("Error updating quantity:", error);
      showToast('error', error.message || 'Gagal memperbarui jumlah produk');
    } finally {
      setUpdatingItems(prev => prev.filter(itemId => itemId !== id));
    }
  };

  const deleteItem = async (id: string) => {
    const item = cartItems.find(item => item.id === id);
    if (!item) return;

    setDeletingItems(prev => [...prev, id]);

    try {
      const response = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Gagal menghapus item");
      }

      // Hapus dari state jika berhasil
      setCartItems((items) => items.filter((item) => item.id !== id));
      showToast('success', `${item.name} berhasil dihapus dari keranjang`);
    } catch (error: any) {
      console.error("Error deleting item:", error);
      showToast('error', error.message || 'Terjadi kesalahan saat menghapus item');
    } finally {
      setDeletingItems(prev => prev.filter(itemId => itemId !== id));
    }
  };

  const handleDeleteItem = (id: string) => {
    deleteItem(id);
  };

  const handleDeleteSelected = async () => {
    const selectedIds = cartItems.filter(item => item.selected).map(item => item.id);
    const selectedNames = cartItems.filter(item => item.selected).map(item => item.name);
    
    if (selectedIds.length === 0) {
      showToast('error', 'Tidak ada produk yang dipilih');
      return;
    }

    setDeletingItems(prev => [...prev, ...selectedIds]);

    try {
      // Delete each selected item
      const deletePromises = selectedIds.map(id => 
        fetch(`/api/cart/${id}`, { method: "DELETE" })
      );

      const responses = await Promise.all(deletePromises);
      const failedDeletes = responses.filter(response => !response.ok);

      if (failedDeletes.length > 0) {
        throw new Error(`Gagal menghapus ${failedDeletes.length} item`);
      }

      // Remove successful deletes from state
      setCartItems(items => items.filter(item => !selectedIds.includes(item.id)));
      
      showToast('success', `${selectedIds.length} produk berhasil dihapus dari keranjang`);
    } catch (error: any) {
      console.error("Error deleting selected items:", error);
      showToast('error', error.message || 'Terjadi kesalahan saat menghapus produk');
    } finally {
      setDeletingItems(prev => prev.filter(id => !selectedIds.includes(id)));
    }
  };

  const allSelected = cartItems.length > 0 && cartItems.every((item) => item.selected);
  const selectedCount = selectedItems.length;

  return (
    <>
      <NavKeranjang />
      
      {/* Toast Notification */}
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <div className="bg-gray-50 pt-6 md:pt-10 pb-6 md:pb-10">
        <div className="max-w-5xl mx-auto px-4 md:px-0">
          <h2 className="text-lg md:text-xl ml-0 md:ml-2 font-bold mb-4 text-black">Daftar Produk</h2>
          
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-xl md:rounded-2xl p-8 text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Keranjang Kosong</h3>
              <p className="text-gray-500 mb-4">Belum ada produk dalam keranjang Anda</p>
              <button
                onClick={() => window.location.href = '/katalog'}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Mulai Berbelanja
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              {/* Product List Section */}
              <div className="xl:col-span-2">
                <div className="bg-white rounded-xl md:rounded-2xl">
                  {/* Header */}
                  <div className="p-3 md:p-4 border-b-8 md:border-b-14 border-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="w-4 h-4 text-[#26A81D] bg-white border-2 border-[#26A81D] rounded focus:ring-[#26A81D]"
                          style={{ accentColor: "#26A81D" }}
                        />
                        <span className="text-xs md:text-sm font-medium">Pilih semua ({cartItems.length})</span>
                      </div>

                      {selectedCount > 0 && (
                        <button
                          onClick={handleDeleteSelected}
                          disabled={deletingItems.length > 0}
                          className="px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm font-medium text-[#26A81D] hover:text-[#1A7F16] hover:bg-[#D9F2D6] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-1"
                        >
                          {deletingItems.length > 0 && (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#26A81D]"></div>
                          )}
                          Hapus {selectedCount > 1 ? `(${selectedCount})` : ''}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Product Items */}
                  <div className="divide-y-8 md:divide-y-14 divide-gray-50">
                    {cartItems.map((item) => {
                      const isDeleting = deletingItems.includes(item.id);
                      const isUpdating = updatingItems.includes(item.id);
                      
                      return (
                        <div 
                          key={item.id} 
                          className={`p-3 md:p-4 lg:p-5 hover:bg-gray-100 transition-all ${isDeleting ? 'opacity-50' : ''}`}
                        >
                          <div className="flex items-start gap-3 md:gap-4">
                            {/* Checkbox */}
                            <input
                              type="checkbox"
                              checked={item.selected}
                              onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                              disabled={isDeleting}
                              className="w-4 h-4 text-[#26A81D] bg-white border-2 border-[#26A81D] rounded focus:ring-[#26A81D] mt-1"
                            />

                            {/* Product Image */}
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Product Info & Controls */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 md:gap-3">
                                {/* Product Details */}
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-medium text-gray-900 mb-1 text-xs md:text-sm line-clamp-2 leading-4 md:leading-5">
                                    {item.name}
                                  </h5>
                                  <p className="text-xs text-[#26A81D] font-medium">Stok : {item.stock}</p>
                                </div>

                                {/* Price & Controls */}
                                <div className="flex flex-col items-start md:items-end gap-2">
                                  <span className="text-sm md:text-base font-semibold text-gray-900">
                                    Rp{item.price.toLocaleString("id-ID")}
                                  </span>

                                  <div className="flex items-center gap-2">
                                    {/* Delete */}
                                    <button
                                      onClick={() => handleDeleteItem(item.id)}
                                      disabled={isDeleting || isUpdating}
                                      className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                                    >
                                      {isDeleting ? (
                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-500"></div>
                                      ) : (
                                        <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                      )}
                                    </button>

                                    {/* Quantity */}
                                    <div className={`flex items-center border border-gray-300 rounded-full bg-white ${isUpdating ? 'opacity-75' : ''}`}>
                                      <button
                                        onClick={() => handleQuantityChange(item.id, -1)}
                                        disabled={item.quantity <= 1 || isDeleting || isUpdating}
                                        className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-full"
                                      >
                                        <Minus className="h-3 w-3 md:h-3.5 md:w-3.5 text-gray-600" />
                                      </button>
                                      <div className="px-2 md:px-3 py-1 text-xs font-medium min-w-[1.5rem] md:min-w-[2rem] text-center relative">
                                        {isUpdating && (
                                          <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-500"></div>
                                          </div>
                                        )}
                                        <span className={isUpdating ? 'invisible' : ''}>{item.quantity}</span>
                                      </div>
                                      <button
                                        onClick={() => handleQuantityChange(item.id, 1)}
                                        disabled={item.quantity >= item.stock || isDeleting || isUpdating}
                                        className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-full"
                                      >
                                        <Plus className="h-3 w-3 md:h-3.5 md:w-3.5 text-gray-600" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Order Summary Section */}
              <div className="xl:col-span-1">
                <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 xl:sticky xl:top-4">
                  <h3 className="text-sm md:text-base font-semibold mb-3 md:mb-4 text-gray-900">Ringkasan Pesanan</h3>

                  <div className="space-y-2 md:space-y-3 mb-4 md:mb-5 text-xs md:text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total harga ({selectedCount} Produk)</span>
                      <span className="font-semibold text-gray-900">Rp{totalPrice.toLocaleString("id-ID")}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Potongan Diskon</span>
                      <span className="font-semibold text-[#26A81D]">-Rp{discount.toLocaleString("id-ID")}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Estimasi Ongkir</span>
                      <span className="font-semibold text-gray-900">Rp{shippingEstimate.toLocaleString("id-ID")}</span>
                    </div>

                    <div className="border-t border-gray-300 border-dashed pt-2 md:pt-3">
                      <div className="flex justify-between items-center font-bold text-gray-900">
                        <span>Total Pesanan</span>
                        <span>Rp{finalTotal.toLocaleString("id-ID")}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={selectedCount === 0 || deletingItems.length > 0 || updatingItems.length > 0}
                    className="w-full bg-[#26A81D] hover:bg-[#1A7F16] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 md:py-2.5 rounded-lg text-xs md:text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    {(deletingItems.length > 0 || updatingItems.length > 0) ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Memproses...
                      </>
                    ) : (
                      'Checkout'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;