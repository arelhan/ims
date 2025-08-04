"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type DecommissionedItem = {
  id: string;
  name: string;
  description?: string;
  serialNumber?: string;
  category: { id: string; name: string };
  brand: { id: string; name: string };
  assignedTo?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
};

export default function DecommissionedPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [archiveLoading, setArchiveLoading] = useState(false);

  const { data: items = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['decommissioned-items'],
    queryFn: async () => {
      const res = await fetch("/api/inventory");
      if (!res.ok) throw new Error("Veriler alınamadı");
      const allItems = await res.json();
      
      // Sadece hizmet dışı bırakılmış ürünleri filtrele
      const decommissionedItems = allItems.filter(
        (item: any) => item.status === "DECOMMISSIONED"
      );
      return decommissionedItems;
    },
  });

  const handleArchiveAll = async () => {
    if (items.length === 0) {
      alert("Arşivlenecek ürün bulunamadı.");
      return;
    }

    if (!confirm(`${items.length} ürünü arşivlemek istediğinizden emin misiniz? Bu ürünler artık çöp kutusunda görünmeyecek.`)) {
      return;
    }

    setArchiveLoading(true);
    try {
      const response = await fetch("/api/admin/archive-trash", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        alert(`${result.archivedCount} ürün başarıyla arşivlendi!`);
        // React Query cache'lerini invalidate et
        queryClient.invalidateQueries({ queryKey: ['decommissioned-items'] });
        queryClient.invalidateQueries({ queryKey: ['inventory'] });
      } else {
        const error = await response.text();
        alert(`Hata: ${error}`);
      }
    } catch (error) {
      console.error("Archive error:", error);
      alert("Arşivleme sırasında bir hata oluştu!");
    }
    setArchiveLoading(false);
  };

  const isAdmin = session?.user && (session.user as any).role === "ADMIN";

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('laptop') || name.includes('notebook')) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z" />
        </svg>
      );
    } else if (name.includes('printer') || name.includes('yazıcı')) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zM9 9h6v2H9V9z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Hizmet Dışı Ürünler</h1>
        <div className="flex items-center gap-4">
          {isAdmin && items.length > 0 && (
            <button
              onClick={handleArchiveAll}
              disabled={archiveLoading}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l6 6 6-6" />
              </svg>
              {archiveLoading ? "Arşivleniyor..." : "Arşive Kaldır"}
            </button>
          )}
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>{items.length} ürün</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          Hata: {error.message}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <span className="ml-2">Yükleniyor...</span>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <p className="text-lg">Henüz hizmet dışı bırakılmış ürün yok</p>
              <p className="text-sm">Ürünleri hizmet dışı bırakmak için envanter sayfasını kullanın</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {items.map((item) => (
                <div key={item.id} className="bg-red-50 border border-red-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600 flex-shrink-0">
                      {getCategoryIcon(item.category?.name || 'default')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.category?.name || 'Kategori yok'}</p>
                      {item.description && (
                        <p className="text-xs text-gray-500 mb-2 line-clamp-2">{item.description}</p>
                      )}
                      <div className="flex flex-col gap-1 text-xs text-gray-500">
                        <div>Marka: {item.brand?.name || 'Bilinmiyor'}</div>
                        {item.serialNumber && (
                          <div>Seri: {item.serialNumber}</div>
                        )}
                        {item.assignedTo && (
                          <div>Son Kullanıcı: {item.assignedTo.name}</div>
                        )}
                      </div>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Hizmet Dışı
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
