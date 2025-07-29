'use client';

import useTranslation from '@/hooks/useTranslation';
import LanguageSelector from '@/components/LanguageSelector';

export default function I18nTestPage() {
  const { t, locale } = useTranslation();

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Çok Dilli Test Sayfası</h1>
        <LanguageSelector />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Mevcut Dil: {locale}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Navigasyon</h3>
            <ul className="space-y-1 text-sm">
              <li>{t('nav.home')}</li>
              <li>{t('nav.warehouse')}</li>
              <li>{t('nav.inventory')}</li>
              <li>{t('nav.management')}</li>
              <li>{t('nav.profile')}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Dashboard</h3>
            <ul className="space-y-1 text-sm">
              <li>{t('dashboard.title')}</li>
              <li>{t('dashboard.subtitle')}</li>
              <li>{t('dashboard.quickAccess')}</li>
              <li>{t('dashboard.addAsset')}</li>
              <li>{t('dashboard.viewInventory')}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Formlar</h3>
            <ul className="space-y-1 text-sm">
              <li>{t('forms.name')}</li>
              <li>{t('forms.email')}</li>
              <li>{t('forms.save')}</li>
              <li>{t('forms.cancel')}</li>
              <li>{t('forms.loading')}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Mesajlar</h3>
            <ul className="space-y-1 text-sm">
              <li>{t('messages.success')}</li>
              <li>{t('messages.error')}</li>
              <li>{t('messages.lowStock')}</li>
              <li>{t('messages.totalValue')}</li>
              <li>{t('messages.archive')}</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Test Notları:</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Üst sağdaki dil seçiciyi kullanarak dili değiştirebilirsiniz</li>
          <li>• Çeviriler dinamik olarak yüklenir</li>
          <li>• Eğer bir çeviri bulunamasa fallback olarak anahtar döner</li>
          <li>• Desteklenen diller: Türkçe (tr), İngilizce (en), Arnavutça (sq)</li>
        </ul>
      </div>
    </div>
  );
}
