import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import useTranslation from "@/hooks/useTranslation";
import { 
  HomeIcon, 
  BuildingStorefrontIcon, 
  ClipboardDocumentListIcon,
  Cog6ToothIcon 
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  BuildingStorefrontIcon as BuildingStorefrontIconSolid,
  ClipboardDocumentListIcon as ClipboardDocumentListIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid
} from "@heroicons/react/24/solid";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const params = useParams();
  const { t } = useTranslation();
  const locale = (params?.locale as string) || 'tr';

  const navItems = [
    {
      name: t('nav.home'),
      href: `/${locale}/dashboard`,
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
    },
    {
      name: t('nav.warehouse'),
      href: `/${locale}/warehouse`, 
      icon: BuildingStorefrontIcon,
      iconSolid: BuildingStorefrontIconSolid,
    },
    {
      name: t('nav.inventory'),
      href: `/${locale}/inventory`,
      icon: ClipboardDocumentListIcon,
      iconSolid: ClipboardDocumentListIconSolid,
    },
    {
      name: t('nav.management'),
      href: `/${locale}/management`,
      icon: Cog6ToothIcon,
      iconSolid: Cog6ToothIconSolid,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = isActive ? item.iconSolid : item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center py-2 px-1 ${
                isActive 
                  ? "text-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
