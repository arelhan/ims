"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import QRCodeCanvas from "../../../../../components/QRCodeCanvas";
import DynamicFields from "../../../../../components/DynamicFields";
import useTranslation from "@/hooks/useTranslation";

type InventoryItem = {
  id: string;
  name: string;
  productCode?: string; // Ürün kodu ekledik
  description?: string;
  serialNumber?: string;
  category: { id: string; name: string; code: string; fieldTemplate?: any };
  brand: { id: string; name: string };
  status: string;
  assignedTo?: { id: string; name: string };
  specifications?: any;
  // Yeni alanlar
  location?: string;
  purchasePrice?: number;
  purchaseDate?: string;
  warrantyDate?: string;
  supplier?: string;
  model?: string;
  condition?: string;
  barcode?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export default function InventoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : "";
  const locale = params.locale as string;

  // React Query ile data fetch
  const { data: item, isLoading, error } = useQuery({
    queryKey: ['inventory', id],
    queryFn: async () => {
      const res = await fetch(`/api/inventory?id=${id}`);
      if (!res.ok) throw new Error(t('details.productNotFound'));
      return res.json();
    },
    enabled: !!id, // id varsa sorgu çalıştır
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch("/api/user");
      if (!res.ok) throw new Error(t('details.usersNotLoaded'));
      return res.json();
    },
  });
  const [qrModal, setQrModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    productCode: "",
    description: "",
    serialNumber: "",
    status: "",
    assignedToId: "",
    location: "",
    purchasePrice: "",
    purchaseDate: "",
    warrantyDate: "",
    supplier: "",
    model: "",
    condition: "",
    barcode: "",
    notes: "",
    specifications: {},
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Edit form'u item verisi ile güncelle
  React.useEffect(() => {
    if (item) {
      setEditForm({
        name: item.name,
        productCode: item.productCode || "",
        description: item.description || "",
        serialNumber: item.serialNumber || "",
        status: item.status,
        assignedToId: item.assignedTo?.id || "",
        location: item.location || "",
        purchasePrice: item.purchasePrice?.toString() || "",
        purchaseDate: item.purchaseDate?.split('T')[0] || "",
        warrantyDate: item.warrantyDate?.split('T')[0] || "",
        supplier: item.supplier || "",
        model: item.model || "",
        condition: item.condition || "",
        barcode: item.barcode || "",
        notes: item.notes || "",
        specifications: item.specifications || {},
      });
    }
  }, [item]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    
    try {
      // Durum mantığını otomatik belirle
      let finalStatus = editForm.status;
      let finalAssignedToId = editForm.assignedToId;
      
      // Eğer kullanıcı seçilmişse ve durum AVAILABLE ise, otomatik ASSIGNED yap
      if (editForm.assignedToId && editForm.status === "AVAILABLE") {
        finalStatus = "ASSIGNED";
      }
      
      // Eğer kullanıcı seçilmemişse (depoda), durum AVAILABLE olmalı
      if (!editForm.assignedToId) {
        finalStatus = "AVAILABLE";
        finalAssignedToId = null;
      }
      
      const updateData = {
        name: editForm.name,
        description: editForm.description,
        serialNumber: editForm.serialNumber,
        status: finalStatus,
        assignedToId: finalAssignedToId,
        location: editForm.location,
        purchasePrice: editForm.purchasePrice ? parseFloat(editForm.purchasePrice) : undefined,
        purchaseDate: editForm.purchaseDate || undefined,
        warrantyDate: editForm.warrantyDate || undefined,
        supplier: editForm.supplier,
        model: editForm.model,
        condition: editForm.condition,
        barcode: editForm.barcode,
        notes: editForm.notes,
        specifications: editForm.specifications,
      };
      
      const res = await fetch(`/api/inventory?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Güncelleme başarısız");
      }
      
      const updatedItem = await res.json();
      // React Query cache'ini güncelle
      queryClient.setQueryData(['inventory', id], updatedItem);
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['decommissioned-items'] });
      setEditModal(false);
    } catch (err: any) {
      setEditError(err.message || "Bir hata oluştu");
    }
    setEditLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(t('details.deleteConfirmText'))) return;
    
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/inventory?id=${id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) throw new Error(t('messages.error'));
      
      // React Query cache'lerini invalidate et
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', id] });
      queryClient.invalidateQueries({ queryKey: ['decommissioned-items'] });
      
      router.push(`/${locale}/inventory`);
    } catch {
      alert(t('messages.error'));
    }
    setDeleteLoading(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto mt-12 px-4">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">{t('details.loading')}</span>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-4xl mx-auto mt-12 px-4">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error?.message || t('details.productNotFound')}
        </div>
        <button
          onClick={() => router.push(`/${locale}/inventory`)}
          className="mt-4 text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← {t('forms.back')}
        </button>
      </div>
    );
  }

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
        return t('inventory.available');
      case "ASSIGNED":
        return t('inventory.assigned');
      case "IN_SERVICE":
        return t('inventory.inUse');
      case "DECOMMISSIONED":
        return t('inventory.outOfService');
      default:
        return status;
    }
  };

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
    <div className="max-w-4xl mx-auto mt-12 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/${locale}/inventory`)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-gray-800">{t('details.title')}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Info */}
          <div className="lg:col-span-2">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                {getCategoryIcon(item.category?.name || 'default')}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {item.productCode || item.name}
                </h2>
                <p className="text-sm text-gray-500 mb-2">
                  {item.description || t('messages.noData')}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {getStatusText(item.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">{t('details.productCode')}</h3>
                <p className="text-gray-900 font-mono">{item.productCode || t('details.na')}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">{t('details.serialNumber')}</h3>
                <p className="text-gray-900">{item.serialNumber || t('details.serialNotSpecified')}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">{t('details.category')}</h3>
                <p className="text-gray-900">{item.category?.name || t('details.noCategory')}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">{t('details.brand')}</h3>
                <p className="text-gray-900">{item.brand?.name || t('details.noBrand')}</p>
              </div>
              {item.model && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">{t('details.model')}</h3>
                  <p className="text-gray-900">{item.model}</p>
                </div>
              )}
              {item.location && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">{t('details.location')}</h3>
                  <p className="text-gray-900">{item.location}</p>
                </div>
              )}
              {item.purchasePrice && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">{t('details.purchasePrice')}</h3>
                  <p className="text-gray-900">{item.purchasePrice.toLocaleString('tr-TR')} ₺</p>
                </div>
              )}
              {item.purchaseDate && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Satın Alma Tarihi</h3>
                  <p className="text-gray-900">{new Date(item.purchaseDate).toLocaleDateString("tr-TR")}</p>
                </div>
              )}
              {item.warrantyDate && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Garanti Bitiş Tarihi</h3>
                  <p className="text-gray-900">{new Date(item.warrantyDate).toLocaleDateString("tr-TR")}</p>
                </div>
              )}
              {item.supplier && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Tedarikçi</h3>
                  <p className="text-gray-900">{item.supplier}</p>
                </div>
              )}
              {item.barcode && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Barkod</h3>
                  <p className="text-gray-900">{item.barcode}</p>
                </div>
              )}
              {item.condition && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">{t('details.condition')}</h3>
                  <p className="text-gray-900 capitalize">{item.condition}</p>
                </div>
              )}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">{t('details.assignedUser')}</h3>
                <p className="text-gray-900">{item.assignedTo?.name || t('details.notAssigned')}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">{t('details.createdAt')}</h3>
                <p className="text-gray-900">{new Date(item.createdAt).toLocaleDateString("tr-TR")}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">{t('details.updatedAt')}</h3>
                <p className="text-gray-900">{new Date(item.updatedAt).toLocaleDateString("tr-TR")}</p>
              </div>
            </div>

            {/* Notes Section */}
            {item.notes && (
              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-700 mb-2">{t('details.notes')}</h3>
                <p className="text-blue-900">{item.notes}</p>
              </div>
            )}

            {/* Dynamic Category Fields */}
            {item.specifications && Object.keys(item.specifications).length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  {item.category?.name} {t('details.specialFields')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(item.specifications).map(([key, value]) => (
                    <div key={key} className="bg-purple-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-purple-700 mb-1">{key}</h4>
                      <p className="text-purple-900">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-800 mb-4">{t('details.actions')}</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setEditModal(true)}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {t('details.edit')}
                </button>
                <button
                  onClick={() => setQrModal(true)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  {t('details.qrCode')}
                </button>
                <button
                  onClick={() => window.print()}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zM9 9h6v2H9V9z" />
                  </svg>
                  {t('details.print')}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {deleteLoading ? t('details.processing') : t('details.decommissioned')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {qrModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-4">{t('details.qrCode')}</h2>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <QRCodeCanvas
                  value={JSON.stringify({
                    itemId: item.id,
                    productCode: item.productCode || item.name,
                    itemName: item.name,
                    category: item.category?.name || t('details.noCategory'),
                    brand: item.brand?.name || t('details.noBrand'),
                    serialNumber: item.serialNumber,
                    assignedTo: item.assignedTo?.name,
                    status: item.status,
                    url: (typeof window !== "undefined" ? window.location.origin : "") + "/inventory/" + item.id
                  })}
                  size={200}
                />
                <p className="text-xs text-gray-500 mt-2">
                  {t('details.qrContainsInfo')}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  onClick={() => {
                    const canvas = document.querySelector('canvas');
                    if (canvas) {
                      const link = document.createElement('a');
                      link.download = 'qr-' + (item.productCode || item.name).replace(/\s+/g, '-') + '.png';
                      link.href = canvas.toDataURL();
                      link.click();
                    }
                  }}
                >
                  {t('details.download')}
                </button>
                <button
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                  onClick={() => setQrModal(false)}
                >
                  {t('details.close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t('details.editProduct')}</h2>
            
            {editError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded mb-4">
                {editError}
              </div>
            )}
            
            <form onSubmit={handleEdit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('details.productCode')}
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
                    value={editForm.productCode || item.productCode || t('details.na')}
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('details.productCodeCannotChange')}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('details.description')}
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('details.serialNumber')}
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={editForm.serialNumber}
                      onChange={(e) => setEditForm({ ...editForm, serialNumber: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('details.model')}
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={editForm.model}
                      onChange={(e) => setEditForm({ ...editForm, model: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('details.location')}
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      placeholder={t('forms.location')}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('details.purchasePrice')}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={editForm.purchasePrice}
                      onChange={(e) => setEditForm({ ...editForm, purchasePrice: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Satın Alma Tarihi
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={editForm.purchaseDate}
                      onChange={(e) => setEditForm({ ...editForm, purchaseDate: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Garanti Bitiş Tarihi
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={editForm.warrantyDate}
                      onChange={(e) => setEditForm({ ...editForm, warrantyDate: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tedarikçi
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={editForm.supplier}
                      onChange={(e) => setEditForm({ ...editForm, supplier: e.target.value })}
                      placeholder="Tedarikçi firma adı"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Barkod
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={editForm.barcode}
                      onChange={(e) => setEditForm({ ...editForm, barcode: e.target.value })}
                      placeholder="Barkod numarası"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('details.condition')}
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={editForm.condition}
                      onChange={(e) => setEditForm({ ...editForm, condition: e.target.value })}
                    >
                      <option value="">{t('forms.selectCondition')}</option>
                      <option value="new">{t('forms.new')}</option>
                      <option value="used">{t('forms.used')}</option>
                      <option value="refurbished">{t('forms.refurbished')}</option>
                      <option value="damaged">{t('forms.damaged')}</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('inventory.status')}
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  >
                    <option value="AVAILABLE">{t('inventory.available')}</option>
                    <option value="ASSIGNED">{t('inventory.assigned')}</option>
                    <option value="IN_SERVICE">{t('inventory.inUse')}</option>
                    <option value="DECOMMISSIONED">{t('inventory.outOfService')}</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('forms.assignUser')}
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={editForm.assignedToId}
                    onChange={(e) => setEditForm({ ...editForm, assignedToId: e.target.value })}
                  >
                    <option value="">{t('forms.notAssigned')}</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('details.notes')}
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={2}
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    placeholder={t('forms.notesPlaceholder')}
                  />
                </div>
                
                {/* Dinamik kategori alanları */}
                {item?.category?.fieldTemplate && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">
                      {item.category.name} {t('details.specialFields')}
                    </h3>
                    <DynamicFields
                      template={item?.category?.fieldTemplate}
                      values={editForm.specifications}
                      onChange={(specs) => setEditForm({ ...editForm, specifications: specs })}
                    />
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                  onClick={() => {
                    setEditModal(false);
                    setEditError(null);
                  }}
                >
                  {t('forms.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  disabled={editLoading}
                >
                  {editLoading ? t('forms.saving') : t('forms.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {qrModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">{t('details.qrCode')}</h2>
              <button
                onClick={() => setQrModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <QRCodeCanvas 
                  value={`${window.location.origin}/info/${item?.productCode}`}
                  size={200} 
                  className="border border-gray-200 rounded-lg"
                />
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">{t('details.productCode')}:</span><br />
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    {item?.productCode}
                  </span>
                </p>
                <p>
                  <span className="font-medium">{t('forms.infoPage')}:</span><br />
                  <a 
                    href={`${window.location.origin}/info/${item?.productCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono bg-blue-50 px-2 py-1 rounded text-blue-700 text-xs break-all hover:bg-blue-100 hover:text-blue-800 transition-colors cursor-pointer underline"
                  >
                    {window.location.origin}/info/{item?.productCode}
                  </a>
                </p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setQrModal(false)}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  {t('details.close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
