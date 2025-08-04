"use client";

import React, { useState, useEffect } from "react";

const tabs = [
  { key: "users", label: "Kullanıcılar" },
  { key: "units", label: "Birimler" },
  { key: "categories", label: "Kategoriler" },
  { key: "brands", label: "Markalar" },
];

const ManagementPage = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Yönetim Paneli</h1>
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded-t ${
              activeTab === tab.key
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-b shadow p-6">
        {activeTab === "users" && <UsersTab />}
        {activeTab === "units" && <UnitsTab />}
        {activeTab === "categories" && <CategoriesTab />}
        {activeTab === "brands" && <BrandsTab />}
      </div>
    </div>
  );
};

function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
    unitId: "",
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchUnits();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/user");
      if (!res.ok) throw new Error("Kullanıcılar alınamadı");
      setUsers(await res.json());
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    }
    setLoading(false);
  }

  async function fetchUnits() {
    try {
      const res = await fetch("/api/unit");
      if (!res.ok) throw new Error("Birimler alınamadı");
      setUnits(await res.json());
    } catch (err: any) {
      console.error("Birimler yüklenemedi:", err);
    }
  }

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Kayıt başarısız");
      }
      setShowAdd(false);
      setAddForm({ name: "", email: "", password: "", role: "USER", unitId: "" });
      fetchUsers();
    } catch (err: any) {
      setAddError(err.message || "Bir hata oluştu");
    }
    setAddLoading(false);
  }

  async function handleDeleteUser(id: string) {
    if (!window.confirm("Bu kullanıcı silinsin mi?")) return;
    setDeleteLoading(id);
    try {
      const res = await fetch(`/api/user?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Silinemedi");
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {}
    setDeleteLoading(null);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Kullanıcılar</h2>
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          onClick={() => setShowAdd(true)}
        >
          + Kullanıcı Ekle
        </button>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Ad Soyad</th>
              <th className="py-2 px-4 border-b">E-posta</th>
              <th className="py-2 px-4 border-b">Rol</th>
              <th className="py-2 px-4 border-b">Birim</th>
              <th className="py-2 px-4 border-b">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{user.name}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.role}</td>
                <td className="py-2 px-4 border-b">
                  {user.unit ? user.unit.name : (user.role === "ADMIN" ? "Admin" : "Birim Atanmamış")}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="text-red-600 hover:underline"
                    disabled={deleteLoading === user.id}
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    {deleteLoading === user.id ? "Siliniyor..." : "Sil"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Kullanıcı Ekle Modalı */}
      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowAdd(false)}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Geri
              </button>
              <h2 className="text-lg font-bold">Yeni Kullanıcı</h2>
              <button
                onClick={() => setShowAdd(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Ad Soyad</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={addForm.name}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">E-posta</label>
                <input
                  type="email"
                  className="w-full border px-3 py-2 rounded"
                  value={addForm.email}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, email: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Şifre</label>
                <input
                  type="password"
                  className="w-full border px-3 py-2 rounded"
                  value={addForm.password}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, password: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Rol</label>
                <select
                  className="w-full border px-3 py-2 rounded"
                  value={addForm.role}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, role: e.target.value }))
                  }
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              {addForm.role !== "ADMIN" && (
                <div>
                  <label className="block mb-1 font-medium">Birim <span className="text-red-500">*</span></label>
                  <select
                    className="w-full border px-3 py-2 rounded"
                    value={addForm.unitId}
                    onChange={(e) =>
                      setAddForm((f) => ({ ...f, unitId: e.target.value }))
                    }
                    required={addForm.role !== "ADMIN"}
                  >
                    <option value="">Birim Seçin</option>
                    {units.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {addError && (
                <div className="text-red-600 text-sm">{addError}</div>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
                disabled={addLoading}
              >
                {addLoading ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function UnitsTab() {
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: "" });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUnits();
  }, []);

  async function fetchUnits() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/unit");
      if (!res.ok) throw new Error("Birimler alınamadı");
      setUnits(await res.json());
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    }
    setLoading(false);
  }

  async function handleAddUnit(e: React.FormEvent) {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    try {
      const res = await fetch("/api/unit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Kayıt başarısız");
      }
      setShowAdd(false);
      setAddForm({ name: "" });
      fetchUnits();
    } catch (err: any) {
      setAddError(err.message || "Bir hata oluştu");
    }
    setAddLoading(false);
  }

  async function handleDeleteUnit(id: string) {
    if (!window.confirm("Bu birim silinsin mi?")) return;
    setDeleteLoading(id);
    try {
      const res = await fetch(`/api/unit?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Silinemedi");
      setUnits((prev) => prev.filter((u) => u.id !== id));
    } catch {}
    setDeleteLoading(null);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Birimler</h2>
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          onClick={() => setShowAdd(true)}
        >
          + Birim Ekle
        </button>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Birim Adı</th>
              <th className="py-2 px-4 border-b">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {units.map((unit) => (
              <tr key={unit.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{unit.name}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="text-red-600 hover:underline"
                    disabled={deleteLoading === unit.id}
                    onClick={() => handleDeleteUnit(unit.id)}
                  >
                    {deleteLoading === unit.id ? "Siliniyor..." : "Sil"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Birim Ekle Modalı */}
      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowAdd(false)}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Geri
              </button>
              <h2 className="text-lg font-bold">Yeni Birim</h2>
              <button
                onClick={() => setShowAdd(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddUnit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Birim Adı</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={addForm.name}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </div>
              {addError && (
                <div className="text-red-600 text-sm">{addError}</div>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
                disabled={addLoading}
              >
                {addLoading ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function CategoriesTab() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", code: "" });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/category");
      if (!res.ok) throw new Error("Kategoriler alınamadı");
      setCategories(await res.json());
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    }
    setLoading(false);
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    try {
      const res = await fetch("/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Kayıt başarısız");
      }
      setShowAdd(false);
      setAddForm({ name: "", code: "" });
      fetchCategories();
    } catch (err: any) {
      setAddError(err.message || "Bir hata oluştu");
    }
    setAddLoading(false);
  }

  async function handleDeleteCategory(id: string) {
    if (!window.confirm("Bu kategori silinsin mi?")) return;
    setDeleteLoading(id);
    try {
      const res = await fetch(`/api/category?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Silinemedi");
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch {}
    setDeleteLoading(null);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Kategoriler</h2>
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          onClick={() => setShowAdd(true)}
        >
          + Kategori Ekle
        </button>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Kategori Adı</th>
              <th className="py-2 px-4 border-b">Kod</th>
              <th className="py-2 px-4 border-b">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{cat.name}</td>
                <td className="py-2 px-4 border-b">{cat.code || "-"}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="text-red-600 hover:underline"
                    disabled={deleteLoading === cat.id}
                    onClick={() => handleDeleteCategory(cat.id)}
                  >
                    {deleteLoading === cat.id ? "Siliniyor..." : "Sil"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Kategori Ekle Modalı */}
      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowAdd(false)}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Geri
              </button>
              <h2 className="text-lg font-bold">Yeni Kategori</h2>
              <button
                onClick={() => setShowAdd(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Kategori Adı</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={addForm.name}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">3 Harfli Kod</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={addForm.code}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
                  }
                  maxLength={3}
                  placeholder="LPT, PRT, vb."
                />
              </div>
              {addError && (
                <div className="text-red-600 text-sm">{addError}</div>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
                disabled={addLoading}
              >
                {addLoading ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function BrandsTab() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: "" });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  async function fetchBrands() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/brand");
      if (!res.ok) throw new Error("Markalar alınamadı");
      setBrands(await res.json());
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    }
    setLoading(false);
  }

  async function handleAddBrand(e: React.FormEvent) {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    try {
      const res = await fetch("/api/brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Kayıt başarısız");
      }
      setShowAdd(false);
      setAddForm({ name: "" });
      fetchBrands();
    } catch (err: any) {
      setAddError(err.message || "Bir hata oluştu");
    }
    setAddLoading(false);
  }

  async function handleDeleteBrand(id: string) {
    if (!window.confirm("Bu marka silinsin mi?")) return;
    setDeleteLoading(id);
    try {
      const res = await fetch(`/api/brand?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Silinemedi");
      setBrands((prev) => prev.filter((b) => b.id !== id));
    } catch {}
    setDeleteLoading(null);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Markalar</h2>
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          onClick={() => setShowAdd(true)}
        >
          + Marka Ekle
        </button>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Marka Adı</th>
              <th className="py-2 px-4 border-b">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{brand.name}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="text-red-600 hover:underline"
                    disabled={deleteLoading === brand.id}
                    onClick={() => handleDeleteBrand(brand.id)}
                  >
                    {deleteLoading === brand.id ? "Siliniyor..." : "Sil"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Marka Ekle Modalı */}
      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowAdd(false)}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Geri
              </button>
              <h2 className="text-lg font-bold">Yeni Marka</h2>
              <button
                onClick={() => setShowAdd(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddBrand} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Marka Adı</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={addForm.name}
                  onChange={(e) =>
                    setAddForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </div>
              {addError && (
                <div className="text-red-600 text-sm">{addError}</div>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
                disabled={addLoading}
              >
                {addLoading ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagementPage;
