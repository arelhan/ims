import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Admin kontrolü
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Transaction kullanarak tüm verileri sil
    await prisma.$transaction(async (tx) => {
      // 1. Önce foreign key constraints'e dikkat ederek sırayla sil
      
      // Audit Trail kayıtları
      await tx.auditTrail.deleteMany({});
      
      // Service Record kayıtları
      await tx.serviceRecord.deleteMany({});
      
      // Decommissioned kayıtları
      await tx.decommissioned.deleteMany({});
      
      // Inventory kayıtları
      await tx.inventory.deleteMany({});
      
      // Category kayıtları
      await tx.category.deleteMany({});
      
      // Brand kayıtları
      await tx.brand.deleteMany({});
      
      // Admin olmayan kullanıcıları sil
      await tx.user.deleteMany({
        where: {
          role: {
            not: "ADMIN"
          }
        }
      });
      
      // Unit kayıtları (sadece kullanıcısı olmayanları)
      const unitsWithUsers = await tx.unit.findMany({
        where: {
          users: {
            some: {}
          }
        },
        select: { id: true }
      });
      
      const unitIdsWithUsers = unitsWithUsers.map(unit => unit.id);
      
      await tx.unit.deleteMany({
        where: {
          id: {
            notIn: unitIdsWithUsers
          }
        }
      });
    });

    console.log("Database cleared successfully by admin:", session.user.email);
    
    return NextResponse.json({ 
      success: true, 
      message: "Veritabanı başarıyla temizlendi" 
    });

  } catch (error) {
    console.error("Database clear error:", error);
    return NextResponse.json(
      { error: "Veritabanı temizleme sırasında hata oluştu" },
      { status: 500 }
    );
  }
}
