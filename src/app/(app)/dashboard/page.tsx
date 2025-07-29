"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";

type DashboardStats = {
  totalUsers: number;
  totalAssets: number;
  warehouseAssets: number;
  lowStock: number;
  totalValue: number;
};

const DashboardPage = () => {
  // React Query ile data fetch
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch("/api/user");
      if (!res.ok) throw new Error("Kullanıcılar alınamadı");
      return res.json();
    },
  });

  const { data: inventoryItems = [], isLoading: inventoryLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const res = await fetch("/api/inventory");
      if (!res.ok) throw new Error("Envanter alınamadı");
      return res.json();
    },
  });

  const loading = usersLoading || inventoryLoading;

  // Stats hesapla
  const stats: DashboardStats = React.useMemo(() => {
    if (loading) return { totalUsers: 0, totalAssets: 0, warehouseAssets: 0, lowStock: 0, totalValue: 0 };

    // Toplam varlık - sadece aktif durumda olanlar (AVAILABLE ve ASSIGNED)
    const totalAssets = inventoryItems.filter(
      (item: any) => 
        item.status === "AVAILABLE" || item.status === "ASSIGNED"
    ).length;

    // Depodaki varlıklar (assignedToId: null ve status: AVAILABLE)
    const warehouseAssets = inventoryItems.filter(
      (item: any) =>
        (!("assignedToId" in item) || item.assignedToId === null) &&
        item.status === "AVAILABLE",
    ).length;

    // Düşük stok (aynı kategori ve marka için 3 veya daha az olanlar)
    const stockMap: Record<string, number> = {};
    for (const item of inventoryItems) {
      const key = (item.category?.id || "") + "-" + (item.brand?.id || "");
      stockMap[key] = (stockMap[key] || 0) + 1;
    }
    const lowStock = Object.values(stockMap).filter(
      (count) => count <= 3,
    ).length;

    // Toplam değer (örnek: birim fiyat yoksa toplam varlık sayısı * 10000 ₺)
    const totalValue = totalAssets * 10000;

    return {
      totalUsers: users.length,
      totalAssets,
      warehouseAssets,
      lowStock,
      totalValue,
    };
  }, [users, inventoryItems, loading]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto mt-12 px-4">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Pano</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard label="Toplam Kullanıcı" value={stats.totalUsers} />
        <StatCard label="Toplam Varlık" value={stats.totalAssets} />
        <StatCard label="Depodaki Varlıklar" value={stats.warehouseAssets} />
        <StatCard label="Düşük Stok Uyarısı" value={stats.lowStock} warning />
        <StatCard
          label="Toplam Envanter Değeri"
          value={stats.totalValue + " ₺"}
        />
      </div>
    </div>
  );
};

function StatCard({
  label,
  value,
  warning,
}: {
  label: string;
  value: string | number;
  warning?: boolean;
}) {
  return (
    <div
      className={`rounded shadow p-6 bg-white flex flex-col items-center ${
        warning ? "border-2 border-red-400" : "border"
      }`}
    >
      <div className="text-lg font-semibold mb-2">{label}</div>
      <div
        className={`text-3xl font-bold ${
          warning ? "text-red-600" : "text-blue-700"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

export default DashboardPage;
