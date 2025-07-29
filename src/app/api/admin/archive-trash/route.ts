import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { InventoryStatus } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Admin kontrolü
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // DECOMMISSIONED durumundaki ürünleri bul ve ARCHIVED durumuna geçir
    const decommissionedItems = await prisma.inventory.findMany({
      where: {
        status: InventoryStatus.DECOMMISSIONED
      },
      select: {
        id: true,
        name: true
      }
    });

    if (decommissionedItems.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: "Arşivlenecek ürün bulunamadı",
        archivedCount: 0
      });
    }

    // Transaction ile güvenli arşivleme
    await prisma.$transaction(async (tx) => {
      // Ürünleri ARCHIVED durumuna geçir
      await tx.inventory.updateMany({
        where: {
          status: InventoryStatus.DECOMMISSIONED
        },
        data: {
          status: InventoryStatus.ARCHIVED,
          assignedToId: null, // Atamayı kaldır
        }
      });

      // Decommissioned kayıtlarını sil (artık gerekmez)
      await tx.decommissioned.deleteMany({
        where: {
          inventoryId: {
            in: decommissionedItems.map(item => item.id)
          }
        }
      });
    });

    console.log(`${decommissionedItems.length} items archived by admin:`, session.user.email);
    
    return NextResponse.json({ 
      success: true, 
      message: `${decommissionedItems.length} ürün arşivlendi`,
      archivedCount: decommissionedItems.length
    });

  } catch (error) {
    console.error("Archive trash error:", error);
    return NextResponse.json(
      { error: "Arşivleme sırasında hata oluştu" },
      { status: 500 }
    );
  }
}
