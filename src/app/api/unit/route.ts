import { NextRequest, NextResponse } from "next/server";
import {
  getAllUnits,
  getUnitById,
  createUnit,
  updateUnit,
  deleteUnit,
} from "../../../lib/services/unit/unitService";
import { z } from "zod";

// Birim oluşturma ve güncelleme için Zod şeması
const unitSchema = z.object({
  name: z.string().min(1),
});

// GET /api/unit - Tüm birimleri getir veya id ile tek bir birimi getir
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (id) {
      const unit = await getUnitById(id);
      if (!unit) {
        return NextResponse.json(
          { error: "Birim bulunamadı" },
          { status: 404 },
        );
      }
      return NextResponse.json(unit);
    }
    const units = await getAllUnits();
    return NextResponse.json(units);
  } catch (error) {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

// POST /api/unit - Yeni birim oluştur
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = unitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: parsed.error.issues },
        { status: 400 },
      );
    }
    const unit = await createUnit(parsed.data);
    return NextResponse.json(unit, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

// PUT /api/unit?id=... - Birim güncelle
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }
    const body = await req.json();
    const parsed = unitSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: parsed.error.issues },
        { status: 400 },
      );
    }
    const updated = await updateUnit(id, parsed.data);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

// DELETE /api/unit?id=... - Birim sil
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }
    const deleted = await deleteUnit(id);
    return NextResponse.json(deleted);
  } catch (error) {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
