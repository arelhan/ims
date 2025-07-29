import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
  console.log("Admin kullanıcısı oluşturuluyor...");

  try {
    // Önce admin kullanıcısının zaten var olup olmadığını kontrol et
    const existing = await prisma.user.findUnique({
      where: { email: 'admin@ims.local' }
    });
    
    if (existing) {
      console.log("⚪ Admin kullanıcısı zaten mevcut");
      return;
    }

    // Admin şifresini hash'le
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Admin kullanıcısını oluştur
    const admin = await prisma.user.create({
      data: {
        email: 'admin@ims.local',
        password: hashedPassword,
        name: 'System Administrator',
        role: 'ADMIN'
      }
    });
    
    console.log("✅ Admin kullanıcısı oluşturuldu");
    console.log("📧 Email: admin@ims.local");
    console.log("🔑 Şifre: admin123");
    
  } catch (error) {
    console.error("❌ Admin kullanıcısı oluşturulamadı:", error.message);
  }
}

createAdminUser()
  .catch((e) => {
    console.error("Hata:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
