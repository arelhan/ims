"use client";

import React from "react";
import Link from "next/link";
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
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="mt-3 text-gray-600">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Ana Pano</h1>
        <p className="text-gray-600">Sistem durumu ve özet bilgiler</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard 
          label="Toplam Kullanıcı" 
          value={stats.totalUsers} 
          icon="👥"
          color="blue"
        />
        <StatCard 
          label="Toplam Varlık" 
          value={stats.totalAssets} 
          icon="📦"
          color="green"
        />
        <StatCard 
          label="Depodaki Varlıklar" 
          value={stats.warehouseAssets} 
          icon="🏢"
          color="indigo"
        />
        <StatCard 
          label="Düşük Stok Uyarısı" 
          value={stats.lowStock} 
          icon="⚠️"
          color="red"
          warning 
        />
        <StatCard
          label="Toplam Envanter Değeri"
          value={`${(stats.totalValue).toLocaleString('tr-TR')} ₺`}
          icon="💰"
          color="yellow"
          className="sm:col-span-2 lg:col-span-1"
        />
      </div>
      
      {/* Hızlı erişim kartları */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Hızlı Erişim</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <QuickActionCard
            href="/warehouse"
            title="Yeni Varlık Ekle"
            description="Sisteme yeni varlık kaydedin"
            icon="➕"
            color="blue"
          />
          <QuickActionCard
            href="/inventory"
            title="Envanter Yönetimi"
            description="Tüm varlıkları görüntüleyin ve yönetin"
            icon="�"
            color="green"
          />
          <QuickActionCard
            href="/decommissioned"
            title="Arşiv"
            description="Kullanım dışı varlıklar"
            icon="📥"
            color="gray"
          />
          <QuickActionCard
            href="/management"
            title="Yönetim Paneli"
            description="Sistem ayarlarını yönetin"
            icon="⚙️"
            color="purple"
          />
        </div>
      </div>
    </div>
  );
};

function StatCard({
  label,
  value,
  warning,
  icon,
  color = "blue",
  className = "",
}: {
  label: string;
  value: string | number;
  warning?: boolean;
  icon?: string;
  color?: string;
  className?: string;
}) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
    red: "bg-red-50 border-red-200 text-red-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
  };

  return (
    <div
      className={`card-mobile ${warning ? "border-red-300 bg-red-50" : ""} ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-gray-600">{label}</div>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <div
        className={`text-2xl md:text-3xl font-bold ${
          warning ? "text-red-600" : `text-${color}-600`
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function QuickActionCard({
  href,
  title,
  description,
  icon,
  color = "blue",
}: {
  href: string;
  title: string;
  description: string;
  icon: string;
  color?: string;
}) {
  return (
    <Link
      href={href}
      className="card-mobile hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer group block"
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg bg-${color}-100 text-${color}-600 text-xl group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
          <span className="text-lg">→</span>
        </div>
      </div>
    </Link>
  );
}

export default DashboardPage;
