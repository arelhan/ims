"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/warehouse", label: "Depo" },
  { href: "/inventory", label: "Envanter" },
  { href: "/decommissioned", label: "Çöp Kutusu" },
  { href: "/units", label: "Birimler" },
  { href: "/management", label: "Yönetim" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-blue-700 text-white px-6 py-3 flex items-center gap-6 shadow">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`hover:underline transition ${
            pathname?.startsWith(item.href) ? "font-bold underline" : ""
          }`}
        >
          {item.label}
        </Link>
      ))}
      <div className="flex-1" />
      <Link
        href="/profile"
        className={`hover:underline transition ${
          pathname === "/profile" ? "font-bold underline" : ""
        }`}
      >
        Profil
      </Link>
    </nav>
  );
}
