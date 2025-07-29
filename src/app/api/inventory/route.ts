import { NextRequest, NextResponse } from "next/server";
import {
  getAllInventory,
  createInventory,
  updateInventory,
  deleteInventory,
  getInventoryById,
} from "../../../lib/services/inventory/inventoryService";
import { z } from "zod";
import { InventoryStatus } from "@prisma/client";

// Envanter oluşturma ve güncelleme için Zod şeması
const inventorySchema = z.object({
  name: z.string().optional(), // Ürün kodu sistemi için optional
  description: z.string().min(1), // Açıklama zorunlu
  serialNumber: z.string().optional(),
  categoryId: z.string().min(1),
  brandId: z.string().min(1),
  status: z.nativeEnum(InventoryStatus).optional(),
  assignedToId: z.string().optional().nullable(),
  productCode: z.string().optional(), // Otomatik oluşturulacak
  // Yeni ekstra alanlar
  location: z.string().optional(),
  purchaseDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  purchasePrice: z.number().optional(),
  warrantyDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  model: z.string().optional(),
  specifications: z.any().optional(),
  notes: z.string().optional(),
  barcode: z.string().optional(),
  condition: z.string().optional(),
});

// GET /api/inventory - Tüm envanterleri getir
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (id) {
      const item = await getInventoryById(id);
      if (!item) {
        return NextResponse.json(
          { error: "Envanter bulunamadı" },
          { 
            status: 404,
            headers: {
              'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
            }
          }
        );
      }
      return NextResponse.json(item, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
        }
      });
    }
    const items = await getAllInventory();
    return NextResponse.json(items, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

// POST /api/inventory - Yeni envanter oluştur
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = inventorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: parsed.error.issues },
        { status: 400 },
      );
    }
    const item = await createInventory(parsed.data);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

// PUT /api/inventory?id=... - Envanter güncelle
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }
    const body = await req.json();
    const parsed = inventorySchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: parsed.error.issues },
        { status: 400 },
      );
    }
    const updated = await updateInventory(id, parsed.data);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

// DELETE /api/inventory?id=... - Envanter hizmet dışı bırak (soft delete)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }
    
    // Gerçekte silme değil, hizmet dışı bırakma
    const decommissioned = await updateInventory(id, {
      status: InventoryStatus.DECOMMISSIONED,
      assignedToId: null, // Hiç kimseye atanmamış olsun
    });
    
    return NextResponse.json(decommissioned);
  } catch (error) {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
