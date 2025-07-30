'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export interface TranslationFile {
  [key: string]: any;
}

export function useTranslation() {
  const [translations, setTranslations] = useState<TranslationFile>({});
  const params = useParams();
  const router = useRouter();
  
  // URL params'dan locale'i al - geçerli locale'leri kontrol et
  const validLocales = ['tr', 'en', 'sq'];
  const paramLocale = params?.locale as string;
  const currentLocale = validLocales.includes(paramLocale) ? paramLocale : 'tr';

  useEffect(() => {
    loadTranslations(currentLocale);
  }, [currentLocale]);

  const loadTranslations = async (locale: string) => {
    try {
      const response = await fetch(`/locales/${locale}/common.json`);
      const translations = await response.json();
      setTranslations(translations);
    } catch (error) {
      console.error('Translation yüklenirken hata:', error);
      // Fallback olarak Türkçe yükle
      if (locale !== 'tr') {
        try {
          const fallbackResponse = await fetch('/locales/tr/common.json');
          const fallbackTranslations = await fallbackResponse.json();
          setTranslations(fallbackTranslations);
        } catch (fallbackError) {
          console.error('Fallback translation yüklenirken hata:', fallbackError);
        }
      }
    }
  };

  const changeLanguage = (newLocale: string) => {
    // Mevcut path'i al ve locale'i değiştir
    const currentPath = window.location.pathname;
    const segments = currentPath.split('/').filter(Boolean);
    
    // Eğer ilk segment locale ise kaldır
    if (segments[0] && ['tr', 'en', 'sq'].includes(segments[0])) {
      segments.shift();
    }
    
    // Yeni locale ile path oluştur
    const newPath = `/${newLocale}${segments.length > 0 ? '/' + segments.join('/') : ''}`;
    router.push(newPath);
  };

  const t = (key: string, defaultValue?: string): string => {
    const keys = key.split('.');
    let result = translations;
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return defaultValue || key;
      }
    }
    
    return typeof result === 'string' ? result : defaultValue || key;
  };

  return {
    t,
    locale: currentLocale,
    changeLanguage,
    translations
  };
}

export default useTranslation;
