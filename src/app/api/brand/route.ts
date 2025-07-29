import { NextRequest, NextResponse } from "next/server";
import {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../../../lib/services/brand/brandService";
import { z } from "zod";

// Marka oluşturma ve güncelleme için Zod şeması
const brandSchema = z.object({
  name: z.string().min(1),
});

// GET /api/brand - Tüm markaları getir veya id ile tek marka getir
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (id) {
      const brand = await getBrandById(id);
      if (!brand) {
        return NextResponse.json(
          { error: "Marka bulunamadı" },
          { status: 404 },
        );
      }
      return NextResponse.json(brand);
    }
    const brands = await getAllBrands();
    return NextResponse.json(brands);
  } catch (error) {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

// POST /api/brand - Yeni marka oluştur
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = brandSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: parsed.error.issues },
        { status: 400 },
      );
    }
    const brand = await createBrand(parsed.data);
    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

// PUT /api/brand?id=... - Marka güncelle
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }
    const body = await req.json();
    const parsed = brandSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: parsed.error.issues },
        { status: 400 },
      );
    }
    const updated = await updateBrand(id, parsed.data);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

// DELETE /api/brand?id=... - Marka sil
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }
    const deleted = await deleteBrand(id);
    return NextResponse.json(deleted);
  } catch (error) {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
