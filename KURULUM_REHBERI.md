# IMS (Inventory Management System) Kurulum Rehberi

## Gereksinimler
- Node.js (v18 veya üzeri)
- PostgreSQL (v14 veya üzeri)
- Git
- npm veya yarn

## 1. Projeyi İndirme

```bash
# Projeyi klonla (GitHub/GitLab repository URL'ini buraya ekle)
git clone [REPOSITORY_URL]
cd ims

# Alternatif: Eğer henüz git repository'si yoksa, zip olarak indir
```

## 2. Bağımlılıkları Kurma

```bash
# Node.js bağımlılıklarını kur
npm install

# Veya yarn kullanıyorsan
yarn install
```

## 3. Veritabanı Kurulumu

### PostgreSQL Kurulumu (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### PostgreSQL Kurulumu (macOS)
```bash
brew install postgresql
brew services start postgresql
```

### PostgreSQL Kurulumu (Windows)
- PostgreSQL resmi sitesinden indirip kur: https://www.postgresql.org/download/windows/

### Veritabanı Oluşturma
```bash
# PostgreSQL'e bağlan
sudo -u postgres psql

# Veritabanı ve kullanıcı oluştur
CREATE DATABASE ims_db;
CREATE USER ims_user WITH PASSWORD 'güçlü_şifre_buraya';
GRANT ALL PRIVILEGES ON DATABASE ims_db TO ims_user;
\q
```

## 4. Ortam Değişkenlerini Ayarlama

`.env` dosyası oluştur (proje ana dizininde):

```env
# Veritabanı Bağlantısı
DATABASE_URL="postgresql://ims_user:güçlü_şifre_buraya@localhost:5432/ims_db"

# NextAuth Ayarları
NEXTAUTH_SECRET="çok_güçlü_random_secret_buraya"
NEXTAUTH_URL="http://localhost:3000"

# Geliştirme Ortamı
NODE_ENV="development"
```

## 5. Veritabanı Şemasını Oluşturma

```bash
# Prisma veritabanını başlat
npx prisma generate
npx prisma db push

# İsteğe bağlı: Örnek veriler ekle
npx prisma db seed
```

## 6. Uygulamayı Çalıştırma

```bash
# Geliştirme modunda çalıştır
npm run dev

# Veya yarn kullanıyorsan
yarn dev
```

Uygulama http://localhost:3000 adresinde çalışacak.

## 7. Önemli URL'ler

- Ana sayfa: http://localhost:3000
- Envanter: http://localhost:3000/inventory
- Depo: http://localhost:3000/warehouse
- Dashboard: http://localhost:3000/dashboard
- Giriş: http://localhost:3000/login

## 8. Mevcut Özellikler

### ✅ Tamamlanan Özellikler:
- **Otomatik Ürün Kodu Sistemi**: Kategori bazlı benzersiz kodlar (örn: DSA-000001)
- **İki Adımlı Modal Sistemi**: Warehouse sayfasında kategori seçimi → form
- **Güncellenmiş Düzenle Modal**: Ürün kodu disabled, yeni alanlar eklendi
- **QR Kod Sistemi**: Ürün detaylarını içeren QR kodlar
- **Dinamik Kategori Alanları**: Kategori bazlı özel form alanları
- **Modern UX**: Responsive tasarım, iconlar, animasyonlar

### 🏗️ Mevcut Sistem Yapısı:
```
src/
├── app/
│   ├── (app)/
│   │   ├── dashboard/          # Dashboard sayfası
│   │   ├── inventory/          # Envanter listesi
│   │   │   └── [id]/          # Ürün detay sayfası
│   │   ├── warehouse/          # Depo yönetimi (İki adımlı modal)
│   │   ├── management/         # Yönetim sayfası
│   │   └── profile/           # Profil sayfası
│   ├── (auth)/
│   │   └── login/             # Giriş sayfası
│   └── api/
│       ├── inventory/         # Envanter API endpoints
│       ├── category/          # Kategori API
│       ├── brand/            # Marka API
│       └── user/             # Kullanıcı API
├── components/
│   ├── QRCodeCanvas.tsx      # QR kod bileşeni
│   ├── DynamicFields.tsx     # Dinamik form alanları
│   └── Navbar.tsx           # Navigasyon çubuğu
└── lib/
    ├── prisma.ts            # Prisma client
    ├── types.ts             # TypeScript tipleri
    └── services/            # Servis katmanları
        ├── inventory/       # Envanter servisleri
        ├── category/        # Kategori servisleri
        ├── brand/          # Marka servisleri
        └── user/           # Kullanıcı servisleri
```

## 9. Geliştirme Komutları

```bash
# Veritabanı şemasını güncelle
npx prisma db push

# Prisma Studio'yu aç (veritabanı yönetim arayüzü)
npx prisma studio

# TypeScript tip kontrolü
npm run type-check

# Linting
npm run lint

# Build (production)
npm run build
npm start
```

## 10. Sorun Giderme

### Veritabanı Bağlantı Sorunları:
```bash
# PostgreSQL çalışıyor mu kontrol et
sudo systemctl status postgresql

# Bağlantıyı test et
npx prisma db push
```

### Port Sorunları:
- Eğer 3000 portu meşgulse, package.json'da script'i değiştir:
```json
"dev": "next dev -p 3001"
```

### Prisma Sorunları:
```bash
# Prisma client'ı yeniden oluştur
npx prisma generate

# Cache temizle
rm -rf node_modules/.prisma
npm install
```

## 11. Güvenlik Notları

1. `.env` dosyasını git'e ekleme (.gitignore'da olduğundan emin ol)
2. Üretim ortamında güçlü şifreler kullan
3. NEXTAUTH_SECRET'ı güvenli bir değerle değiştir
4. Veritabanı şifrelerini güçlü yap

## 12. Git Repository Oluşturma

Eğer henüz git repository'si yoksa:

```bash
# Git başlat
git init

# Dosyaları ekle
git add .

# İlk commit
git commit -m "Initial commit: IMS with product code system and two-step modal"

# GitHub/GitLab'a push et
git remote add origin [REPOSITORY_URL]
git push -u origin main
```

## 13. İletişim ve Destek

Herhangi bir sorun yaşarsan:
1. Terminal çıktılarını kontrol et
2. `.env` dosyasının doğru olduğundan emin ol
3. PostgreSQL'in çalıştığını kontrol et
4. Browser console'da hata mesajlarını incele

---

**Son Güncelleme:** 29 Temmuz 2025
**Sistem Versiyonu:** Next.js 14.2.30 + Prisma + PostgreSQL
**Önemli:** Bu sistem tamamen fonksiyonel ve production-ready!
