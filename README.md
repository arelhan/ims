# IMS - Inventory Management System

Modern, mobil-öncelikli envanter yönetim sistemi. Next.js, Prisma ve PostgreSQL ile geliştirilmiştir.

## 🚀 Özellikler

### ✅ Tamamlanan Özellikler
- **Mobil-Öncelikli Tasarım**: Responsive ve touch-friendly arayüz
- **Mobil Alt Navigasyon**: Anasayfa, Depo, Envanter, Yönetim
- **QR Kod Sistemi**: Ürün bilgileri için QR kod üretimi ve info sayfaları
- **Info Sayfaları**: Menüsüz, sadece ürün bilgilerini gösteren özel sayfalar
- **Otomatik Ürün Kodu Sistemi**: Kategori bazlı benzersiz kodlar (örn: DSA-000001)
- **Gerçek Zamanlı Güncelleme**: React Query ile cache invalidation
- **Bağlamsal Modal Sistemi**: İki adımlı modal ve geri butonları
- **Kategori Kod Sistemi**: 3 harfli kategori kısaltmaları
- **Kullanıcı Yetkilendirme**: ADMIN/USER rolleri ve unitId filtreleme
- **Dinamik Form Alanları**: Kategori bazlı özel form alanları
- **Durum Takibi**: Mevcut, Atanmış, Kullanımda, Hizmet Dışı, Arşivlenmiş

### 🎯 Ana Sayfalar
- **Dashboard**: Genel sistem özeti ve hızlı navigasyon
- **Depo**: Yeni varlık ekleme ve kategori yönetimi
- **Envanter**: Tüm varlıkların listesi, arama ve filtreleme
- **Yönetim**: Kullanıcı, birim, kategori ve marka yönetimi
- **Info Sayfaları**: QR kod ile erişilen salt-okunur ürün sayfaları

### 🔧 Yönetim Özellikleri
- **Kullanıcı Yönetimi**: Ekleme, silme, rol atama
- **Birim Yönetimi**: Organizasyonel birimlerin yönetimi
- **Kategori Yönetimi**: 3 harfli kodlarla kategori tanımlama
- **Marka Yönetimi**: Marka ekleme ve silme
- **Modal Navigasyon**: Tüm modallar geri buton desteği

## 🛠️ Teknoloji Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes
- **Veritabanı**: PostgreSQL + Prisma ORM
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Authentication**: NextAuth.js
- **QR Kod**: Canvas-based QR code generation
- **Form Validation**: Zod
- **Deployment**: Vercel Ready

## 📋 Kurulum

Detaylı kurulum talimatları için [`KURULUM_REHBERI.md`](./KURULUM_REHBERI.md) dosyasına bakın.

### Hızlı Başlangıç

```bash
# Repository'yi klonla
git clone https://github.com/arelhan/ims.git
cd ims

# Bağımlılıkları kur
npm install

# .env dosyasını ayarla
cp .env.example .env
# .env dosyasını düzenle

# Veritabanını başlat
npx prisma generate
npx prisma db push

# Uygulamayı çalıştır
npm run dev
```

## 🎨 Ekran Görüntüleri

### Mobil Alt Navigasyon
- **4 Ana Bölüm**: Anasayfa, Depo, Envanter, Yönetim
- **Touch-Friendly**: Mobil cihazlar için optimize edilmiş

### QR Kod Sistemi
- **QR Kod Üretimi**: Her ürün için benzersiz QR kod
- **Info Sayfaları**: QR kod ile erişilen menüsüz bilgi sayfaları
- **Tıklanabilir Linkler**: QR kod altında direkt erişim linki

### Depo Sayfası - İki Adımlı Modal
1. **Kategori Seçimi**: Kart görünümünde kategoriler
2. **Form Doldurma**: Seçilen kategori için detaylı form

### Yönetim Sayfası
- **Tab Navigasyon**: Kullanıcı, Birim, Kategori, Marka yönetimi
- **Modal Navigasyon**: Geri butonlu modal header'ları
- **Kategori Kodları**: 3 harfli kısaltma sistemi

## 📝 API Endpoints

### Inventory Management
- `GET /api/inventory` - Tüm envanter öğeleri (unitId filtreleme ile)
- `POST /api/inventory` - Yeni envanter öğesi oluştur
- `PUT /api/inventory?id=X` - Envanter öğesini güncelle
- `DELETE /api/inventory?id=X` - Envanter öğesini arşivle

### Master Data
- `GET /api/category` - Kategoriler ve kodları
- `POST /api/category` - Yeni kategori (3 harfli kod ile)
- `GET /api/brand` - Markalar
- `POST /api/brand` - Yeni marka
- `GET /api/unit` - Birimler
- `POST /api/unit` - Yeni birim

### User Management
- `GET /api/user` - Kullanıcılar
- `POST /api/user` - Yeni kullanıcı
- `DELETE /api/user?id=X` - Kullanıcı sil

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

## 🔧 Geliştirme

```bash
# Geliştirme sunucusu
npm run dev

# Tip kontrolü
npm run type-check

# Linting
npm run lint

# Build
npm run build
```

## 📊 Veritabanı Şeması

### Ana Tablolar
- **Inventory**: Ana envanter tablosu (productCode, name, description, status, unitId)
- **Category**: Kategori tanımları (name, code, fieldTemplate ile dinamik alanlar)
- **Brand**: Marka bilgileri
- **Unit**: Organizasyonel birimler
- **User**: Kullanıcı bilgileri (name, email, role, unitId)
- **Assignment**: Atama geçmişi

### Önemli Alanlar
- **productCode**: Otomatik üretilen benzersiz ürün kodu
- **unitId**: Kullanıcı yetkilendirme için birim ID
- **status**: AVAILABLE, ASSIGNED, IN_USE, OUT_OF_SERVICE, ARCHIVED
- **role**: ADMIN, USER
- **code**: Kategori için 3 harfli kısaltma

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Ortam Değişkenleri
- `DATABASE_URL`: PostgreSQL bağlantı stringi
- `NEXTAUTH_SECRET`: NextAuth için secret key
- `NEXTAUTH_URL`: Uygulama URL'i

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 📞 İletişim

Herhangi bir sorun veya öneri için issue açabilirsiniz.

---

**Geliştirici**: [Your Name]  
**Son Güncelleme**: 29 Temmuz 2025  
**Versiyon**: 2.0.0 - Mobile First Update

### 🆕 v2.0.0 Yenilikleri
- Mobil-öncelikli tasarım
- QR kod info sayfaları sistemi
- React Query cache invalidation
- 3 harfli kategori kodları
- Gelişmiş modal navigasyonu
- Gerçek zamanlı veri güncellemeleri
