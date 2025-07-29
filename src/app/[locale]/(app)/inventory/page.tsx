"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useTranslation } from "../../../../hooks/useTranslation";

type InventoryItem = {
  id: string;
  name: string;
  category: { id: string; name: string };
  brand: { name: string };
  serialNumber?: string;
  model?: string;
  assignedTo?: { name: string };
  updatedAt: string;
};

type Category = { id: string; name: string; _count?: { assets: number } };

// Category icons mapping (same as warehouse)
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
  } else if (name.includes('mouse') || name.includes('fare') || name.includes('keyboard') || name.includes('klavye')) {
    return (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
  } else if (name.includes('server') || name.includes('sunucu')) {
    return (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    );
  } else if (name.includes('phone') || name.includes('telefon') || name.includes('mobile')) {
    return (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
  } else if (name.includes('cable') || name.includes('kablo')) {
    return (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    );
  } else {
    return (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    );
  }
};

export default function InventoryPage() {
  // URL parametrelerini kontrol et
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const categoryParam = searchParams.get('category');
  const { t } = useTranslation();

  const [view, setView] = useState<'categories' | 'items'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // React Query ile data fetch
  const { data: allItems = [], isLoading: itemsLoading, error: itemsError } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const res = await fetch("/api/inventory");
      if (!res.ok) throw new Error("Envanter verisi alınamadı");
      return res.json();
    },
  });

  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch("/api/category");
      if (!res.ok) throw new Error("Kategori verisi alınamadı");
      return res.json();
    },
  });

  // Atanmış items'ları filtrele
  const items = allItems.filter(
    (item: any) =>
      item.assignedTo &&
      (item.status === "ASSIGNED" || item.status === "IN_SERVICE"),
  );

  const loading = itemsLoading || categoriesLoading;
  const error = itemsError || categoriesError;

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

  const filteredItems = selectedCategory 
    ? items.filter(item => item.category && item.category.id === selectedCategory.id)
    : items;

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{t('inventory.assignedInventory')}</h1>
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
                {t('inventory.categories')}
              </button>
              <span className="mx-2">{'>'}</span>
              <span className="font-medium">{selectedCategory.name}</span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          Hata: {error.message || "Bir hata oluştu"}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Yükleniyor...</span>
        </div>
      ) : view === 'categories' ? (
        // Category View
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Kategoriler</h2>
            <p className="text-gray-500 text-sm">Bir kategoriye tıklayarak atanmış ürünleri görüntüleyin</p>
          </div>
          {categories.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-lg">Henüz kategori eklenmemiş</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories
                .filter(category => {
                  // Sadece atanmış ürünü olan kategorileri göster
                  const categoryItems = items.filter(item => item.category && item.category.id === category.id);
                  return categoryItems.length > 0;
                })
                .map((category) => {
                const categoryItems = items.filter(item => item.category && item.category.id === category.id);
                const itemCount = categoryItems.length;
                
                return (
                  <div
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category);
                      setView('items');
                      // URL'yi güncelle
                      const url = new URL(window.location.href);
                      url.searchParams.set('category', category.id);
                      window.history.pushState({}, '', url.toString());
                    }}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-lg mb-4 text-green-600 mx-auto">
                        {getCategoryIcon(category.name)}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500 text-center">
                        {itemCount} {t('inventory.assignedProduct')}
                      </p>
                    </div>
                    <div className="bg-gray-50 px-6 py-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{t('inventory.details')}</span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        // Items View
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              {selectedCategory?.name} - {t('inventory.assignedProducts')}
            </h2>
            <p className="text-gray-500 text-sm">
              {filteredItems.length} {t('inventory.assignedProductsFound')}
            </p>
          </div>
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-lg">{t('inventory.noAssignedProducts')}</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('inventory.product')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('inventory.brandModel')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('inventory.assignedPerson')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('inventory.lastUpdate')}</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredItems.map((item) => (
                        <tr 
                          key={item.id} 
                          className="hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => router.push(`/${locale}/inventory/${item.id}`)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3 text-green-600">
                                {getCategoryIcon(item.category?.name || 'default')}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                <div className="text-sm text-gray-500">{item.category?.name || t('inventory.noCategory')}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.brand?.name}</div>
                            {(item as any).model && (
                              <div className="text-sm text-gray-500">{(item as any).model}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.assignedTo?.name || "-"}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(item.updatedAt).toLocaleDateString("tr-TR")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {filteredItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="card-mobile hover:shadow-md cursor-pointer transition-all"
                    onClick={() => router.push(`/${locale}/inventory/${item.id}`)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 flex-shrink-0">
                        {getCategoryIcon(item.category?.name || 'default')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 mb-1">{item.name}</div>
                        <div className="text-sm text-gray-500 mb-2">{item.category?.name || t('inventory.noCategory')}</div>
                        
                        <div className="grid grid-cols-1 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">{t('inventory.brand')}:</span>
                            <span className="ml-2 text-gray-900">{item.brand?.name}</span>
                            {(item as any).model && (
                              <span className="ml-1 text-gray-500">({(item as any).model})</span>
                            )}
                          </div>
                          <div>
                            <span className="text-gray-500">{t('inventory.assignedPerson')}:</span>
                            <span className="ml-2 text-gray-900">{item.assignedTo?.name || "-"}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">{t('inventory.lastUpdate')}:</span>
                            <span className="ml-2 text-gray-500">
                              {new Date(item.updatedAt).toLocaleDateString("tr-TR")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
