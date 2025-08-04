# Windows Kurulum Rehberi - IMS (Inventory Management System)

Bu rehber, sıfırdan kurulan bir Windows makinesinde IMS uygulamasını kurma ve çalıştırma adımlarını açıklar.

## 📋 Gereksinimler

### 1. Node.js Kurulumu
1. [Node.js resmi sitesine](https://nodejs.org/) gidin
2. **LTS (Long Term Support)** sürümünü indirin (v18.0.0 veya üzeri)
3. İndirilen `.msi` dosyasını çalıştırın ve kurulum wizard'ını takip edin
4. Kurulum tamamlandıktan sonra PowerShell veya Command Prompt açın
5. Aşağıdaki komutlarla kurulumu doğrulayın:
   ```cmd
   node --version
   npm --version
   ```

### 2. Git Kurulumu
1. [Git for Windows](https://git-scm.com/download/win) sitesinden Git'i indirin
2. İndirilen dosyayu çalıştırın ve varsayılan ayarlarla kurun
3. Kurulum tamamlandıktan sonra Git Bash veya Command Prompt'ta test edin:
   ```cmd
   git --version
   ```

### 3. PostgreSQL Kurulumu
1. [PostgreSQL resmi sitesinden](https://www.postgresql.org/download/windows/) Windows installer'ı indirin
2. Kurulum sırasında:
   - **Port:** 5432 (varsayılan)
   - **Superuser şifresi:** Güçlü bir şifre belirleyin (örn: `postgres123`)
   - **Locale:** Turkish, Turkey veya English, United States
3. pgAdmin kurulumunu da dahil edin
4. Kurulum sonrası PostgreSQL servisinin çalıştığını kontrol edin

## 🚀 Proje Kurulumu

### 1. Projeyi İndirin
```cmd
git clone https://github.com/arelhan/ims.git
cd ims
```

### 2. Bağımlılıkları Yükleyin
```cmd
npm install
```

### 3. Ortam Değişkenlerini Ayarlayın
1. Proje klasöründe `.env.local` dosyası oluşturun
2. Aşağıdaki içeriği ekleyin ve değerleri kendi sisteminize göre düzenleyin:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/ims_db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here-change-this-in-production"

# Default Language (en, tr, sq)
NEXT_PUBLIC_DEFAULT_LOCALE="en"
```

### 4. Veritabanını Hazırlayın
1. PostgreSQL'de yeni bir veritabanı oluşturun:
   ```sql
   -- pgAdmin'den veya psql'den çalıştırın
   CREATE DATABASE ims_db;
   ```

2. Prisma migration'larını çalıştırın:
   ```cmd
   npx prisma migrate deploy
   ```

3. Veritabanını seed data ile doldurun:
   ```cmd
   npx prisma db seed
   ```

### 5. İlk Admin Kullanıcısını Oluşturun
```cmd
node scripts/create-admin.js
```

Bu komut çalıştırıldığında:
- **Email:** admin@example.com
- **Şifre:** admin123
- **Rol:** ADMIN

### 6. Uygulamayı Başlatın
```cmd
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışmaya başlayacak.

## 🔧 Geliştirme Komutları

### Proje Komutları
```cmd
# Geliştirme modunda çalıştır
npm run dev

# Production build
npm run build

# Production'da çalıştır
npm start

# Linting
npm run lint

# Type checking
npm run type-check
```

### Prisma Komutları
```cmd
# Prisma Studio'yu aç (veritabanı GUI)
npx prisma studio

# Veritabanı şemasını sıfırla
npx prisma migrate reset

# Yeni migration oluştur
npx prisma migrate dev

# Prisma client'ı yeniden oluştur
npx prisma generate
```

### Yararlı Scriptler
```cmd
# Örnek marka verileri oluştur
node scripts/create-brands.js

# Örnek envanter verileri oluştur
node scripts/create-sample-inventory.js

# Kategori şablonlarını güncelle
node scripts/update-category-templates.js
```

## 🌐 Uygulama Kullanımı

### İlk Giriş
1. Tarayıcıda `http://localhost:3000` adresine gidin
2. Login sayfasında admin bilgileriyle giriş yapın:
   - **Email:** admin@example.com
   - **Şifre:** admin123

### Dil Ayarları
- Sağ üst köşedeki dil seçiciden Türkçe, İngilizce veya Arnavutça seçebilirsiniz
- Varsayılan dil `.env.local` dosyasındaki `NEXT_PUBLIC_DEFAULT_LOCALE` ile ayarlanır

### Temel Özellikler
- **Dashboard:** Genel istatistikler ve özet bilgiler
- **Warehouse:** Depo yönetimi
- **Inventory:** Envanter ürün yönetimi
- **Archive:** Arşivlenmiş/devre dışı ürünler
- **Management:** Kategori, marka ve birim yönetimi
- **Profile:** Kullanıcı profili ve sistem yönetimi

## 🐛 Sorun Giderme

### Node.js Sorunları
```cmd
# Node modules'ü temizle ve yeniden yükle
rmdir /s node_modules
del package-lock.json
npm install
```

### Veritabanı Sorunları
```cmd
# Prisma client'ı yeniden oluştur
npx prisma generate

# Veritabanını sıfırla
npx prisma migrate reset
```

### Port Sorunları
Eğer 3000 portu kullanılıyorsa:
```cmd
# Farklı port ile çalıştır
npm run dev -- -p 3001
```

### Cache Sorunları
```cmd
# Next.js cache'ini temizle
rmdir /s .next
npm run dev
```

## 📝 Notlar

- **Güvenlik:** Production ortamında mutlaka güçlü şifreler ve secret key'ler kullanın
- **Backup:** Veritabanınızı düzenli olarak yedekleyin
- **Updates:** Bağımlılıkları düzenli olarak güncelleyin
- **Environment:** Production'da farklı environment dosyası kullanın

## 🆘 Destek

Sorun yaşarsanız:
1. Bu dokümandaki sorun giderme bölümünü kontrol edin
2. GitHub repository'sindeki Issues bölümünü inceleyin
3. Yeni bir issue açın veya mevcut developer'a ulaşın

---

**Son Güncelleme:** Ağustos 2025
**Sürüm:** 1.0.0
