import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Kategori grupları ve kodları
const categoryGroups = {
  "Core Computing & Networking": [
    { name: "Laptop Computer", code: "MWA" },
    { name: "Desktop Computer", code: "CPU" },
    { name: "All-in-One Computer", code: "IDS" },
    { name: "Server", code: "DMH" },
    { name: "Monitor", code: "VDS" },
    { name: "Router", code: "NGS" },
    { name: "Network Switch", code: "PHC" },
    { name: "Uninterruptible Power Supply (UPS)", code: "BPS" },
  ],
  "Peripherals & Input Devices": [
    { name: "Keyboard", code: "AKB" },
    { name: "Mouse", code: "DCN" },
    { name: "External Hard Drive", code: "PDS" },
  ],
  "Printing & Imaging": [
    { name: "Printer", code: "POM" },
    { name: "Scanner", code: "ICD" },
    { name: "Photocopier", code: "DDU" },
    { name: "All-in-One Printer", code: "MOD" },
  ],
  "Communication & Presentation": [
    { name: "Desk Phone", code: "VCS" },
    { name: "Smartphone", code: "MAG" },
    { name: "Projector", code: "BDU" },
    { name: "Webcam", code: "VIC" },
    { name: "Headset", code: "ARG" },
  ],
  "Other Office Equipment": [
    { name: "Paper Shredder", code: "DSA" },
    { name: "Barcode Scanner", code: "PIR" },
    { name: "Fax Machine", code: "TIS" },
  ],
};

async function main() {
  // 1. Birim ekle
  const unit = await prisma.unit.upsert({
    where: { name: "BT" },
    update: {},
    create: {
      name: "BT",
    },
  });

  // 2. Kategorileri gruplar halinde ekle
  console.log("Kategoriler ekleniyor...");
  
  for (const [groupName, categories] of Object.entries(categoryGroups)) {
    console.log(`Grup: ${groupName}`);
    
    for (const category of categories) {
      await prisma.category.upsert({
        where: { name: category.name },
        update: { code: category.code },
        create: {
          name: category.name,
          code: category.code,
        },
      });
      console.log(`  - ${category.name} (${category.code}) eklendi`);
    }
  }

  // 3. Örnek markalar ekle
  const brands = ["Dell", "HP", "Lenovo", "Apple", "Microsoft", "Cisco", "Canon", "Epson"];
  
  for (const brandName of brands) {
    await prisma.brand.upsert({
      where: { name: brandName },
      update: {},
      create: {
        name: brandName,
      },
    });
  }

  // 4. Admin kullanıcı ekle
  const adminEmail = "admin@ims.local";
  const adminPassword = "admin123"; // Giriş için kullanılacak şifre
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: "Admin",
      role: UserRole.ADMIN,
      unitId: unit.id,
    },
  });

  console.log("Seed tamamlandı!");
  console.log(`Admin kullanıcı: ${adminEmail} | Şifre: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
