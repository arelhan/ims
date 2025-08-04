"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/hooks/useTranslation";
import { useSession } from "next-auth/react";

interface QuickActionCardProps {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  href,
  title,
  description,
  icon,
  color,
}) => (
  <Link
    href={href}
    className={`block p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${color}`}
  >
    <div className="flex items-center mb-4">
      <div className="text-3xl mr-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
        {title}
      </h3>
    </div>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </Link>
);

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => (
  <div className={`p-6 rounded-lg shadow-md ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 dark:text-gray-300 text-sm">{title}</p>
        <p className="text-3xl font-bold text-gray-800 dark:text-white">
          {value}
        </p>
      </div>
      <div className="text-4xl opacity-80">{icon}</div>
    </div>
  </div>
);

export default function Dashboard() {
  const { t, locale } = useTranslation();
  const { data: session } = useSession();

  const { data: inventoryData } = useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const response = await fetch("/api/inventory");
      if (!response.ok) throw new Error("Failed to fetch inventory");
      return response.json();
    },
  });

  const { data: userData } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/user");
      if (!response.ok) throw new Error("Failed to fetch users");
      return response.json();
    },
  });

  const stats = {
    totalAssets: inventoryData?.filter((item: any) => 
      item.status !== "DECOMMISSIONED" && item.status !== "ARCHIVED"
    )?.length || 0,
    availableAssets:
      inventoryData?.filter((item: any) => item.status === "AVAILABLE")
        ?.length || 0,
    assignedAssets:
      inventoryData?.filter((item: any) => item.status === "ASSIGNED")?.length ||
      0,
    totalUsers: userData?.length || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {t("dashboard.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t("dashboard.welcome")}, {session?.user?.name}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title={t("dashboard.totalAssets")}
            value={stats.totalAssets}
            icon="📦"
            color="bg-blue-100 dark:bg-blue-900"
          />
          <StatsCard
            title={t("dashboard.availableAssets")}
            value={stats.availableAssets}
            icon="✅"
            color="bg-green-100 dark:bg-green-900"
          />
          <StatsCard
            title={t("dashboard.assignedAssets")}
            value={stats.assignedAssets}
            icon="👤"
            color="bg-yellow-100 dark:bg-yellow-900"
          />
          <StatsCard
            title={t("dashboard.totalUsers")}
            value={stats.totalUsers}
            icon="👥"
            color="bg-purple-100 dark:bg-purple-900"
          />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            {t("dashboard.quickActions")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickActionCard
              href={`/${locale}/warehouse`}
              title={t("dashboard.addAsset")}
              description={t("warehouse.addAsset")}
              icon="➕"
              color="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            />
            <QuickActionCard
              href={`/${locale}/inventory`}
              title={t("dashboard.viewInventory")}
              description={t("inventory.viewAll")}
              icon="📋"
              color="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            />
            <QuickActionCard
              href={`/${locale}/units`}
              title={t("dashboard.manageUnits")}
              description={t("units.manage")}
              icon="🏢"
              color="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            />
            <QuickActionCard
              href={`/${locale}/management`}
              title={t("dashboard.userManagement")}
              description={t("management.users")}
              icon="👤"
              color="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            />
            <QuickActionCard
              href={`/${locale}/decommissioned`}
              title={t("dashboard.decommissioned")}
              description={t("decommissioned.view")}
              icon="🗑️"
              color="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            />
            <QuickActionCard
              href={`/${locale}/profile`}
              title={t("dashboard.profile")}
              description={t("profile.manage")}
              icon="⚙️"
              color="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            {t("dashboard.recentActivity")}
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <p className="text-gray-600 dark:text-gray-300">
              {t("dashboard.noRecentActivity")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
