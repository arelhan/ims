import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Admin kontrolü
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Transaction kullanarak sadece inventory verilerini sil
    await prisma.$transaction(async (tx) => {
      // 1. Önce foreign key constraints'e dikkat ederek sırayla sil
      
      // Audit Trail kayıtları
      await tx.auditTrail.deleteMany({});
      
      // Service Record kayıtları
      await tx.serviceRecord.deleteMany({});
      
      // Decommissioned kayıtları
      await tx.decommissioned.deleteMany({});
      
      // Inventory kayıtları (sadece ürünleri sil, kategoriler ve markalar kalsın)
      await tx.inventory.deleteMany({});
    });

    console.log("Inventory data cleared successfully by admin:", session.user.email);
    
    return NextResponse.json({ 
      success: true, 
      message: "Tüm ürünler başarıyla silindi (kategoriler ve markalar korundu)" 
    });

  } catch (error) {
    console.error("Inventory clear error:", error);
    return NextResponse.json(
      { error: "Ürün verilerini temizleme sırasında hata oluştu" },
      { status: 500 }
    );
  }
}
