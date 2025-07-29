# IMS - Inventory Management System

Modern, kullanıcı dostu envanter yönetim sistemi. Next.js, Prisma ve PostgreSQL ile geliştirilmiştir.

## 🚀 Özellikler

### ✅ Tamamlanan Özellikler
- **Otomatik Ürün Kodu Sistemi**: Kategori bazlı benzersiz kodlar (örn: DSA-000001)
- **İki Adımlı Modal Sistemi**: Depo sayfasında önce kategori seçimi, sonra form
- **Güncellenmiş Düzenle Modal**: Ürün kodu görüntüleme ve genişletilmiş form alanları
- **QR Kod Sistemi**: Ürün bilgilerini içeren QR kodlar
- **Dinamik Kategori Alanları**: Kategori bazlı özel form alanları
- **Modern UX**: Responsive tasarım, iconlar ve animasyonlar
- **Envanter Yönetimi**: Tam CRUD operasyonları
- **Kullanıcı Atama**: Varlıkları kullanıcılara atama sistemi
- **Durum Takibi**: Mevcut, Atanmış, Kullanımda, Hizmet Dışı

### 🎯 Ana Sayfalar
- **Dashboard**: Genel sistem özeti
- **Envanter**: Tüm varlıkların listesi ve detayları
- **Depo**: Yeni varlık ekleme (İki adımlı modal)
- **Yönetim**: Kategori, marka ve kullanıcı yönetimi

## 🛠️ Teknoloji Stack

- **Frontend**: Next.js 14.2.30, React, TypeScript
- **Backend**: Next.js API Routes
- **Veritabanı**: PostgreSQL + Prisma ORM
- **Styling**: Tailwind CSS
- **QR Kod**: Canvas-based QR code generation
- **State Management**: React Query (TanStack Query)

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

### Depo Sayfası - İki Adımlı Modal
1. **Kategori Seçimi**: Kart görünümünde kategoriler
2. **Form Doldurma**: Seçilen kategori için detaylı form

### Envanter Detayı
- Ürün kodu prominently displayed
- Tüm ürün bilgileri grid layout'ta
- QR kod üretimi ve indirme
- Düzenle modalı ile güncelleme

## 📝 API Endpoints

- `GET /api/inventory` - Tüm envanter öğeleri
- `POST /api/inventory` - Yeni envanter öğesi oluştur
- `PUT /api/inventory?id=X` - Envanter öğesini güncelle
- `DELETE /api/inventory?id=X` - Envanter öğesini hizmet dışı bırak
- `GET /api/category` - Kategoriler
- `GET /api/brand` - Markalar
- `GET /api/user` - Kullanıcılar

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
- **Inventory**: Ana envanter tablosu (productCode, name, description, vb.)
- **Category**: Kategori tanımları (fieldTemplate ile dinamik alanlar)
- **Brand**: Marka bilgileri
- **User**: Kullanıcı bilgileri
- **Assignment**: Atama geçmişi

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
**Versiyon**: 1.0.0
