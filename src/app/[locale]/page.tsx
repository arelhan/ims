'use client';

import { useTranslation } from '@/hooks/useTranslation';
import LanguageSelector from '@/components/LanguageSelector';
import Link from 'next/link';

export default function HomePage() {
  const { t, locale } = useTranslation();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {/* Dil seçici - sağ üst köşe */}
      <div className="absolute top-4 right-4">
        <LanguageSelector darkMode={false} />
      </div>

      <div className="bg-white rounded shadow p-8 max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">IMS for IT</h1>
        <p className="mb-6 text-gray-700">
          {t('home.description', 'BT departmanları için modern, güvenli ve kapsamlı bir envanter yönetim sistemi.')}
        </p>
        <Link
          href={`/${locale}/login`}
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded font-semibold hover:bg-blue-700 transition"
        >
          {t('home.loginButton', 'Giriş Yap')}
        </Link>
      </div>
    </main>
  );
}
