import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const brands = [
  'Dell',
  'HP',
  'Lenovo',
  'ASUS',
  'Acer',
  'Apple',
  'Microsoft',
  'Samsung',
  'LG',
  'Canon',
  'Epson',
  'Cisco',
  'TP-Link',
  'Logitech',
  'Intel',
  'AMD',
  'NVIDIA',
  'Seagate',
  'Western Digital',
  'Kingston'
];

async function createBrands() {
  console.log("Temel markalar oluşturuluyor...");

  for (const brandName of brands) {
    try {
      // Marka zaten var mı kontrol et
      const existing = await prisma.brand.findUnique({
        where: { name: brandName }
      });
      
      if (!existing) {
        await prisma.brand.create({
          data: { name: brandName }
        });
        console.log(`✅ ${brandName} markası oluşturuldu`);
      } else {
        console.log(`⚪ ${brandName} markası zaten mevcut`);
      }
    } catch (error) {
      console.log(`❌ ${brandName} markası oluşturulamadı:`, error.message);
    }
  }

  console.log("\n🎉 Tüm markalar hazır!");
}

createBrands()
  .catch((e) => {
    console.error("Hata:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
