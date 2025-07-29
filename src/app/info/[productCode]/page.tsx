"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type InventoryItem = {
  id: string;
  name: string;
  productCode?: string;
  description?: string;
  serialNumber?: string;
  category: { id: string; name: string; code: string };
  brand: { id: string; name: string };
  status: string;
  assignedTo?: { id: string; name: string };
  location?: string;
  purchasePrice?: number;
  model?: string;
  condition?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export default function ProductInfoPage() {
  const params = useParams();
  const router = useRouter();
  const productCode = params.productCode as string;

  // Product code'a göre ürün bul
  const { data: item, isLoading, error } = useQuery({
    queryKey: ['product-info', productCode],
    queryFn: async () => {
      // Tüm inventory'yi çek ve product code'a göre bul
      const res = await fetch("/api/inventory");
      if (!res.ok) throw new Error("Ürünler alınamadı");
      const items: InventoryItem[] = await res.json();
      
      const foundItem = items.find(item => item.productCode === productCode);
      if (!foundItem) throw new Error("Ürün bulunamadı");
      
      return foundItem;
    },
    enabled: !!productCode,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-800";
      case "ASSIGNED":
        return "bg-blue-100 text-blue-800";
      case "IN_SERVICE":
        return "bg-yellow-100 text-yellow-800";
      case "DECOMMISSIONED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "Mevcut";
      case "ASSIGNED":
        return "Atanmış";
      case "IN_SERVICE":
        return "Kullanımda";
      case "DECOMMISSIONED":
        return "Hizmet Dışı";
      default:
        return status;
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName?.toLowerCase() || '';
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
    } else {
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto mt-8 px-4">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-md mx-auto mt-8 px-4">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-center">
          <h2 className="font-semibold mb-2">Ürün Bulunamadı</h2>
          <p className="text-sm">{productCode} kodlu ürün sistemde kayıtlı değil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 px-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-white">
              {getCategoryIcon(item.category?.name || 'default')}
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-bold">
                {item.productCode || item.name}
              </h1>
              <p className="text-blue-100 text-sm">
                {item.category?.name || 'Kategori yok'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Status */}
          <div className="flex justify-center">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
              {getStatusText(item.status)}
            </span>
          </div>

          {/* Basic Info */}
          <div className="space-y-3">
            {item.description && (
              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Açıklama</h3>
                <p className="text-gray-900 text-sm">{item.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Marka</h3>
                <p className="text-gray-900 font-medium">{item.brand?.name || 'Marka yok'}</p>
              </div>

              {item.model && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Model</h3>
                  <p className="text-gray-900">{item.model}</p>
                </div>
              )}

              {item.serialNumber && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Seri Numarası</h3>
                  <p className="text-gray-900 font-mono text-sm">{item.serialNumber}</p>
                </div>
              )}

              {item.location && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Konum</h3>
                  <p className="text-gray-900">{item.location}</p>
                </div>
              )}

              {item.condition && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Fiziksel Durum</h3>
                  <p className="text-gray-900 capitalize">{item.condition}</p>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Atanmış Kullanıcı</h3>
                <p className="text-gray-900">{item.assignedTo?.name || "Atanmamış"}</p>
              </div>

              {item.notes && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Notlar</h3>
                  <p className="text-gray-900 text-sm">{item.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer Info */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Ürün Kodu: <span className="font-mono font-medium">{item.productCode}</span>
            </p>
            <p className="text-xs text-gray-400 text-center mt-1">
              Son güncelleme: {new Date(item.updatedAt).toLocaleDateString('tr-TR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
