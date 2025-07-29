"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";

const navItems = [
  { 
    href: "/dashboard", 
    label: "Ana Sayfa", 
    icon: "🏠",
    description: "Genel görünüm"
  },
  { 
    href: "/warehouse", 
    label: "Depo", 
    icon: "🏢",
    description: "Depo yönetimi"
  },
  { 
    href: "/inventory", 
    label: "Envanter", 
    icon: "📦",
    description: "Varlık listesi"
  },
  { 
    href: "/decommissioned", 
    label: "Arşiv", 
    icon: "🗑️",
    description: "Eski varlıklar"
  },
  { 
    href: "/units", 
    label: "Birimler", 
    icon: "🏛️",
    description: "Departmanlar"
  },
  { 
    href: "/management", 
    label: "Yönetim", 
    icon: "⚙️",
    description: "Sistem ayarları"
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Mobil üst navbar */}
      <div className="header-mobile">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">IMS for IT</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
            >
              <span className="text-xl">{isMenuOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobil menü overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Menü</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <span className="text-xl">✕</span>
                </button>
              </div>
            </div>
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block p-3 rounded-lg transition-all ${
                    pathname?.startsWith(item.href)
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </div>
                </Link>
              ))}
              <hr className="my-4" />
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full text-left p-3 rounded-lg hover:bg-red-50 text-red-600 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🚪</span>
                  <div>
                    <div className="font-medium">Çıkış Yap</div>
                    <div className="text-xs text-red-400">Oturumu sonlandır</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobil alt navigation bar */}
      <div className="nav-mobile md:hidden">
        <div className="flex items-center justify-around">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                pathname?.startsWith(item.href)
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              <span className="text-lg mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop navbar */}
      <nav className="hidden md:flex bg-blue-700 text-white px-6 py-3 items-center gap-6 shadow">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`hover:underline transition flex items-center gap-2 ${
              pathname?.startsWith(item.href) ? "font-bold underline" : ""
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
        <div className="flex-1" />
        <Link
          href="/profile"
          className={`hover:underline transition flex items-center gap-2 ${
            pathname === "/profile" ? "font-bold underline" : ""
          }`}
        >
          <span>👤</span>
          Profil
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="hover:underline transition flex items-center gap-2"
        >
          <span>🚪</span>
          Çıkış
        </button>
      </nav>
    </>
  );
}
