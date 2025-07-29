"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import QRCodeCanvas from "../../../components/QRCodeCanvas";
import DynamicFields from "../../../components/DynamicFields";

// Tipler
type InventoryItem = {
  id: string;
  name: string;
  category: { id: string; name: string };
  brand: { id: string; name: string };
  serialNumber?: string;
  createdAt: string;
};

type Category = { id: string; name: string; code: string; fieldTemplate?: any; _count?: { assets: number } };
type Brand = { id: string; name: string };

// Category icons mapping
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('laptop') || name.includes('notebook')) {
    return (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z" />
      </svg>
    );
  } else if (name.includes('printer') || name.includes('yazıcı')) {
    return (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zM9 9h6v2H9V9z" />
      </svg>
    );
  } else if (name.includes('monitor') || name.includes('ekran')) {
    return (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  } else if (name.includes('phone') || name.includes('telefon')) {
    return (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    );
  } else if (name.includes('server') || name.includes('sunucu')) {
    return (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    );
  }
  // Default icon
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  );
};

export default function WarehousePage() {
  // URL parametrelerini kontrol et
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const queryClient = useQueryClient();

  // State
  const [view, setView] = useState<'categories' | 'items'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Two-step modal state
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState<'category' | 'form'>('category');
  const [selectedCategoryForModal, setSelectedCategoryForModal] = useState<Category | null>(null);
  const [form, setForm] = useState({
    description: "",
    categoryId: "",
    brandId: "",
    serialNumber: "",
    location: "",
    purchasePrice: "",
    model: "",
    condition: "",
    notes: "",
    specifications: {},
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Assignment modal state
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [assignUserId, setAssignUserId] = useState<string>("");
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);

  // QR Code success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [assignedItemData, setAssignedItemData] = useState<{
    item: InventoryItem;
    user: { id: string; name: string };
  } | null>(null);

  // Fetch unassigned items and categories
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Fetch inventory items (unassigned and available)
        const res = await fetch("/api/inventory");
        if (!res.ok) throw new Error("Envanter verisi alınamadı");
        const allItems: InventoryItem[] = await res.json();
        const unassigned = allItems.filter(
          (item) =>
            (!("assignedToId" in item) ||
              (item as any).assignedToId === null) &&
            (item as any).status === "AVAILABLE",
        );
        setItems(unassigned);

        // Fetch categories
        const catRes = await fetch("/api/category");
        if (!catRes.ok) throw new Error("Kategori verisi alınamadı");
        setCategories(await catRes.json());

        // Fetch brands
        const brandRes = await fetch("/api/brand");
        if (!brandRes.ok) throw new Error("Marka verisi alınamadı");
        setBrands(await brandRes.json());
      } catch (err: any) {
        setError(err.message || "Bir hata oluştu");
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // URL parametresine göre kategori seçimi yap
  useEffect(() => {
    if (categoryParam && categories.length > 0) {
      const category = categories.find(cat => cat.id === categoryParam);
      if (category) {
        setSelectedCategory(category);
        setView('items');
      }
    }
  }, [categoryParam, categories]);

  // Category selection for modal
  function handleCategorySelect(category: Category) {
    setSelectedCategoryForModal(category);
    setForm(prev => ({
      ...prev,
      categoryId: category.id,
      brandId: brands[0]?.id || "",
      specifications: {}
    }));
    setModalStep('form');
  }

  // Close modal and reset
  function closeModal() {
    setShowModal(false);
    setModalStep('category');
    setSelectedCategoryForModal(null);
    setFormError(null);
    setForm({
      description: "",
      categoryId: "",
      brandId: brands[0]?.id || "",
      serialNumber: "",
      location: "",
      purchasePrice: "",
      model: "",
      condition: "",
      notes: "",
      specifications: {},
    });
  }

  // Add new asset
  async function handleAddAsset(e: React.FormEvent) {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: form.description,
          categoryId: form.categoryId,
          brandId: form.brandId,
          serialNumber: form.serialNumber,
          location: form.location,
          purchasePrice: form.purchasePrice ? parseFloat(form.purchasePrice) : undefined,
          model: form.model,
          condition: form.condition,
          notes: form.notes,
          specifications: form.specifications,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Kayıt başarısız");
      }
      // Successfully added, update list
      const newItem = await res.json();
      
      // React Query cache'ini güncelle
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      
      setItems((prev) => [...prev, newItem]);
      closeModal();
    } catch (err: any) {
      setFormError(err.message || "Bir hata oluştu");
    }
    setFormLoading(false);
  }

  // Assignment functions
  async function openAssignModal(item: InventoryItem) {
    setSelectedItem(item);
    setAssignModalOpen(true);
    setUsersLoading(true);
    setAssignError(null);
    try {
      const res = await fetch("/api/user");
      if (!res.ok) throw new Error("Kullanıcılar alınamadı");
      const data = await res.json();
      setUsers(data);
      if (data.length > 0) setAssignUserId(data[0].id);
    } catch {
      setUsers([]);
    }
    setUsersLoading(false);
  }

  function closeAssignModal() {
    setAssignModalOpen(false);
    setSelectedItem(null);
    setAssignUserId("");
    setAssignError(null);
  }

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedItem || !assignUserId) return;
    setAssignLoading(true);
    setAssignError(null);
    try {
      const res = await fetch(`/api/inventory?id=${selectedItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignedToId: assignUserId,
          status: "ASSIGNED",
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Atama başarısız");
      }
      
      const assignedUser = users.find(u => u.id === assignUserId);
      if (assignedUser) {
        setAssignedItemData({
          item: selectedItem,
          user: assignedUser
        });
        setShowSuccessModal(true);
      }
      
      // React Query cache'ini güncelle
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      
      setItems((prev) => prev.filter((i) => i.id !== selectedItem.id));
      closeAssignModal();
    } catch (err: any) {
      setAssignError(err.message || "Bir hata oluştu");
    }
    setAssignLoading(false);
  }

  const filteredItems = selectedCategory 
    ? items.filter(item => item.category && item.category.id === selectedCategory.id)
    : items;

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Depo Yönetimi</h1>
          {view === 'items' && selectedCategory && (
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <button 
                onClick={() => {
                  setView('categories');
                  setSelectedCategory(null);
                  // URL'den category parametresini kaldır
                  const url = new URL(window.location.href);
                  url.searchParams.delete('category');
                  window.history.pushState({}, '', url.toString());
                }}
                className="hover:text-blue-600 hover:underline"
              >
                Kategoriler
              </button>
              <span className="mx-2">{'>'}</span>
              <span className="font-medium">{selectedCategory.name}</span>
            </div>
          )}
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2 shadow-md"
          onClick={() => {
            setShowModal(true);
            // Eğer kategori seçili ise direkt form adımına git
            if (selectedCategory) {
              setSelectedCategoryForModal(selectedCategory);
              setForm(prev => ({
                ...prev,
                categoryId: selectedCategory.id,
                brandId: brands[0]?.id || "",
                specifications: {}
              }));
              setModalStep('form');
            } else {
              // Kategori seçili değil ise kategori seçim adımına git
              setModalStep('category');
            }
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Varlık Ekle
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div>
          {view === 'categories' ? (
            // Categories view
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories
                  .filter(category => {
                    // Sadece depoda ürünü olan kategorileri göster
                    const categoryItems = items.filter(item => item.category.id === category.id);
                    return categoryItems.length > 0;
                  })
                  .map((category) => {
                  const categoryItems = items.filter(item => item.category.id === category.id);
                  return (
                    <div
                      key={category.id}
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedCategory(category);
                        setView('items');
                        // URL'yi güncelle
                        const url = new URL(window.location.href);
                        url.searchParams.set('category', category.id);
                        window.history.pushState({}, '', url.toString());
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-blue-600">
                          {getCategoryIcon(category.name)}
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {categoryItems.length} ürün
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">{category.name}</h3>
                      <p className="text-sm text-gray-500">Kod: {category.code}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // Items view for selected category
            <div>
              {filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m12 0h4" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg">Bu kategoride henüz ürün bulunmuyor</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-blue-600">
                          {getCategoryIcon(item.category.name)}
                        </div>
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          Depoda
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">Kategori: {item.category.name}</p>
                      <p className="text-sm text-gray-600 mb-1">Marka: {item.brand.name}</p>
                      {item.serialNumber && (
                        <p className="text-sm text-gray-600 mb-4">Seri: {item.serialNumber}</p>
                      )}
                      <button
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={() => openAssignModal(item)}
                      >
                        Kullanıcıya Ata
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Two-Step Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            {/* Modal Header with Back Button */}
            <div className="flex items-center justify-between mb-6">
              {modalStep === 'form' && (
                <button
                  onClick={() => setModalStep('category')}
                  className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Geri
                </button>
              )}
              <h2 className="text-2xl font-bold flex-1">
                {modalStep === 'category' ? 'Kategori Seçin' : `Yeni Varlık Ekle - ${selectedCategoryForModal?.name}`}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700 ml-4"
                onClick={closeModal}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {modalStep === 'category' ? (
              // Step 1: Category Selection
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category)}
                      className="p-6 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all group text-left"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="text-blue-600 group-hover:text-blue-700 mb-3">
                          {getCategoryIcon(category.name)}
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">{category.name}</h3>
                        <p className="text-sm text-gray-500">Kod: {category.code}</p>
                        <div className="mt-2 text-xs text-gray-400">
                          {category._count?.assets || 0} ürün
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Step 2: Form
              <div>
                <form onSubmit={handleAddAsset} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 font-medium">Ürün Kodu</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 px-3 py-2 rounded bg-gray-50"
                        value={`${selectedCategoryForModal?.code}-XXXXXX`}
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Otomatik oluşturulacak</p>
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Seri Numarası</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={form.serialNumber}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, serialNumber: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-1 font-medium">Açıklama</label>
                    <textarea
                      className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      value={form.description}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, description: e.target.value }))
                      }
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 font-medium">Marka*</label>
                      <select
                        className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={form.brandId}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, brandId: e.target.value }))
                        }
                        required
                      >
                        <option value="">Marka seçin</option>
                        {brands.map((brand) => (
                          <option key={brand.id} value={brand.id}>
                            {brand.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Model</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={form.model}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, model: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 font-medium">Konum</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={form.location}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, location: e.target.value }))
                        }
                        placeholder="Raf/Bölüm"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Satın Alma Fiyatı</label>
                      <input
                        type="number"
                        step="0.01"
                        className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={form.purchasePrice}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, purchasePrice: e.target.value }))
                        }
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 font-medium">Durum</label>
                      <select
                        className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={form.condition}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, condition: e.target.value }))
                        }
                      >
                        <option value="">Durum seçin</option>
                        <option value="new">Yeni</option>
                        <option value="used">Kullanılmış</option>
                        <option value="refurbished">Yenilenmiş</option>
                        <option value="damaged">Hasarlı</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-1 font-medium">Notlar</label>
                    <textarea
                      className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      value={form.notes}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, notes: e.target.value }))
                      }
                    />
                  </div>
                  
                  {/* Dynamic Category Fields */}
                  {selectedCategoryForModal?.fieldTemplate && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-gray-800">
                        {selectedCategoryForModal.name} Özel Alanları
                      </h3>
                      <DynamicFields
                        template={selectedCategoryForModal.fieldTemplate}
                        values={form.specifications}
                        onChange={(specs) => setForm(f => ({ ...f, specifications: specs }))}
                      />
                    </div>
                  )}
                  
                  {formError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                      {formError}
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                      onClick={closeModal}
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      disabled={formLoading}
                    >
                      {formLoading ? "Ekleniyor..." : "Ekle"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {assignModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedItem.name} için kullanıcıya ata
            </h2>
            {usersLoading ? (
              <div className="text-center py-4">Kullanıcılar yükleniyor...</div>
            ) : (
              <form onSubmit={handleAssign} className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Kullanıcı Seç*</label>
                  <select
                    className="w-full border border-gray-300 px-3 py-2 rounded"
                    value={assignUserId}
                    onChange={(e) => setAssignUserId(e.target.value)}
                    required
                  >
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
                {assignError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {assignError}
                  </div>
                )}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                    onClick={closeAssignModal}
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    disabled={assignLoading}
                  >
                    {assignLoading ? "Atanıyor..." : "Ata"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Success Modal with QR Code */}
      {showSuccessModal && assignedItemData && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-8 w-full max-w-md text-center">
            <div className="text-green-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Atama Başarılı!</h2>
            <p className="mb-4">
              <strong>{assignedItemData.item.name}</strong> başarıyla{" "}
              <strong>{assignedItemData.user.name}</strong>'e atandı.
            </p>
            <div className="mb-4">
              <QRCodeCanvas 
                value={JSON.stringify({
                  id: assignedItemData.item.id,
                  name: assignedItemData.item.name,
                  assignedTo: assignedItemData.user.name,
                  assignedAt: new Date().toISOString()
                })}
                size={200}
              />
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => setShowSuccessModal(false)}
            >
              Tamam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
