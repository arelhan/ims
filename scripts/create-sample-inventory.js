import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createSampleInventory() {
  console.log("Örnek envanter öğesi oluşturuluyor...");

  try {
    // Desktop Computer kategorisini bul
    const desktopCategory = await prisma.category.findUnique({
      where: { name: 'Desktop Computer' }
    });
    
    // Dell markasını bul
    const dellBrand = await prisma.brand.findUnique({
      where: { name: 'Dell' }
    });
    
    if (!desktopCategory || !dellBrand) {
      console.log("❌ Kategori veya marka bulunamadı");
      return;
    }

    // Örnek Desktop Computer specifications
    const sampleSpecs = {
      ipAddress: "192.168.1.100",
      domainUser: "john.doe",
      operatingSystem: "Windows 11 Pro",
      processor: "Intel Core i7-12700",
      ramMemory: "16 GB DDR4",
      storageType: "SSD",
      storageCapacity: "512 GB",
      graphicsCard: "NVIDIA GeForce RTX 3060",
      networkInterface: "Gigabit Ethernet",
      warrantyStatus: "Active"
    };
    
    // Envanter öğesi oluştur
    const inventory = await prisma.inventory.create({
      data: {
        name: 'Dell OptiPlex 7090',
        description: 'Örnek masaüstü bilgisayar - dinamik alanlar ile',
        serialNumber: 'DL789123456',
        productCode: 'DSK-000001',
        categoryId: desktopCategory.id,
        brandId: dellBrand.id,
        status: 'AVAILABLE',
        location: 'Bilgi İşlem Deposu',
        purchaseDate: new Date('2024-01-15'),
        purchasePrice: 25000,
        warrantyDate: new Date('2027-01-15'),
        supplier: 'Dell Türkiye',
        model: 'OptiPlex 7090 MT',
        specifications: sampleSpecs,
        condition: 'Yeni',
        notes: 'Kategori-özel alanları test etmek için oluşturulan örnek ürün'
      }
    });
    
    console.log("✅ Örnek envanter öğesi oluşturuldu:", inventory.name);
    console.log("🏷️ Ürün Kodu:", inventory.productCode);
    console.log("📋 Kategori-özel alanlar test edilebilir");
    
  } catch (error) {
    console.error("❌ Örnek envanter oluşturulamadı:", error.message);
  }
}

createSampleInventory()
  .catch((e) => {
    console.error("Hata:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
