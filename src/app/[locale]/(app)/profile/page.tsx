"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

const ProfilePage = () => {
  const { data: session } = useSession();
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [archiveLoading, setArchiveLoading] = useState(false);

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Kullanıcı oturumu bulunamadı.</span>
      </div>
    );
  }

  const handleDatabaseClear = async () => {
    if (deleteConfirm !== "delete") {
      alert("Lütfen 'delete' yazın.");
      return;
    }

    if (!confirm("Bu işlem GERİ ALINAMAZ! Tüm verileri silmek istediğinizden emin misiniz?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/clear-database", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Veritabanı başarıyla temizlendi!");
        setDeleteConfirm("");
        setShowDeleteDialog(false);
        window.location.reload();
      } else {
        const error = await response.text();
        alert(`Hata: ${error}`);
      }
    } catch (error) {
      console.error("Database clear error:", error);
      alert("Bir hata oluştu!");
    }
    setLoading(false);
  };

  const handleArchiveTrash = async () => {
    if (!confirm("Çöp kutusundaki tüm ürünleri arşivlemek istediğinizden emin misiniz?")) {
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
        alert(`${result.archivedCount} ürün arşivlendi!`);
        setShowArchiveDialog(false);
      } else {
        const error = await response.text();
        alert(`Hata: ${error}`);
      }
    } catch (error) {
      console.error("Archive trash error:", error);
      alert("Bir hata oluştu!");
    }
    setArchiveLoading(false);
  };

  const isAdmin = session.user.role === "ADMIN";

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-6">
      {/* Profil Bilgileri */}
      <div className="bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Profil</h1>
        <div className="mb-4 space-y-2">
          <div>
            <span className="font-semibold">Ad Soyad:</span> {session.user.name}
          </div>
          <div>
            <span className="font-semibold">E-posta:</span> {session.user.email}
          </div>
          <div>
            <span className="font-semibold">Rol:</span> {session.user.role}
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Çıkış Yap
        </button>
      </div>

      {/* Admin Özel Araçları */}
      {isAdmin && (
        <div className="bg-white p-8 rounded shadow">
          <h2 className="text-xl font-bold mb-6 text-red-600">⚠️ Admin Araçları</h2>
          
          <div className="space-y-4">
            {/* Veritabanı Temizleme */}
            <div className="border border-red-200 p-4 rounded bg-red-50">
              <h3 className="font-semibold text-red-800 mb-2">Veritabanı Temizleme</h3>
              <p className="text-sm text-red-600 mb-3">
                Bu işlem tüm ürünleri kalıcı olarak siler. Kategoriler ve markalar korunur.
              </p>
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                🗑️ Veritabanını Temizle
              </button>
            </div>

            {/* Çöp Kutusu Arşivleme */}
            <div className="border border-orange-200 p-4 rounded bg-orange-50">
              <h3 className="font-semibold text-orange-800 mb-2">Çöp Kutusu Arşivleme</h3>
              <p className="text-sm text-orange-600 mb-3">
                Çöp kutusundaki ürünleri arşivleyerek pasif hale getirir ve çöp kutusundan kaldırır.
              </p>
              <button
                onClick={() => setShowArchiveDialog(true)}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
                disabled={archiveLoading}
              >
                {archiveLoading ? "Arşivleniyor..." : "📦 Çöp Kutusunu Arşivle"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Veritabanı Temizleme Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-red-600 mb-4">⚠️ Tehlikeli İşlem</h3>
            <p className="text-sm text-gray-600 mb-4">
              Bu işlem GERİ ALINAMAZ! Tüm verileriniz silinecek.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Onaylamak için "delete" yazın:
              </label>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                placeholder="delete"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setDeleteConfirm("");
                  setShowDeleteDialog(false);
                }}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                İptal
              </button>
              <button
                onClick={handleDatabaseClear}
                disabled={loading || deleteConfirm !== "delete"}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition disabled:opacity-50"
              >
                {loading ? "Siliniyor..." : "Sil"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Arşivleme Onay Dialog */}
      {showArchiveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-orange-600 mb-4">📦 Arşivleme Onayı</h3>
            <p className="text-sm text-gray-600 mb-4">
              Çöp kutusundaki tüm ürünler arşivlenecek ve pasif duruma geçecek. Bu ürünler artık çöp kutusunda görünmeyecek.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowArchiveDialog(false)}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                İptal
              </button>
              <button
                onClick={handleArchiveTrash}
                disabled={archiveLoading}
                className="flex-1 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition disabled:opacity-50"
              >
                {archiveLoading ? "Arşivleniyor..." : "Arşivle"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
