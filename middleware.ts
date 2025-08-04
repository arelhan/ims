import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['tr', 'en', 'sq']
const defaultLocale = 'en'

function getLocale(request: NextRequest) {
  // URL'den locale'i kontrol et
  const pathname = request.nextUrl.pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Eğer path'de locale yoksa
  if (pathnameIsMissingLocale) {
    // Her zaman default locale'i döndür (Accept-Language header'ını görmezden gel)
    return defaultLocale
  }

  // Path'deki locale'i al ve geçerli olup olmadığını kontrol et
  const pathLocale = pathname.split('/')[1]
  return locales.includes(pathLocale) ? pathLocale : defaultLocale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Static dosyalar ve API route'ları için middleware'i atla
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/locales') ||
    pathname.includes('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Eğer path'de locale yoksa, locale ekle
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    )
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, locales, static files)
    '/((?!_next|api|locales|favicon.ico|.*\\.|sitemap.xml|robots.txt).*)',
  ],
}
