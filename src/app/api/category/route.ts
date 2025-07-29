import { NextRequest, NextResponse } from "next/server";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../lib/services/category/categoryService";
import { z } from "zod";

// Kategori oluşturma ve güncelleme için Zod şeması
const categorySchema = z.object({
  name: z.string().min(1),
  code: z.string().optional(),
});

// GET /api/category - Tüm kategorileri getir veya id ile tek kategori getir
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (id) {
      const category = await getCategoryById(id);
      if (!category) {
        return NextResponse.json(
          { error: "Kategori bulunamadı" },
          { 
            status: 404,
            headers: {
              'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
            }
          }
        );
      }
      return NextResponse.json(category, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      });
    }
    const categories = await getAllCategories();
    return NextResponse.json(categories, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

// POST /api/category - Yeni kategori oluştur
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: parsed.error.issues },
        { status: 400 },
      );
    }
    const category = await createCategory(parsed.data);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

// PUT /api/category?id=... - Kategori güncelle
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }
    const body = await req.json();
    const parsed = categorySchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: parsed.error.issues },
        { status: 400 },
      );
    }
    const updated = await updateCategory(id, parsed.data);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

// DELETE /api/category?id=... - Kategori sil
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }
    const deleted = await deleteCategory(id);
    return NextResponse.json(deleted);
  } catch (error) {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
