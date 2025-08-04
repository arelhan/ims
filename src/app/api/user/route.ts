import { NextRequest, NextResponse } from "next/server";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../../../lib/services/user/userService";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";

// Kullanıcı oluşturma ve güncelleme için Zod şeması
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.nativeEnum(UserRole).optional(),
  unitId: z.string().optional().nullable().transform(val => val === "" ? null : val),
}).refine((data) => {
  // Admin değilse unitId zorunlu
  if (data.role !== UserRole.ADMIN && !data.unitId) {
    return false;
  }
  return true;
}, {
  message: "Admin olmayan kullanıcılar için birim seçimi zorunludur",
  path: ["unitId"]
});

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  name: z.string().min(1).optional(),
  role: z.nativeEnum(UserRole).optional(),
  unitId: z.string().optional().nullable().transform(val => val === "" ? null : val),
}).refine((data) => {
  // Eğer role güncelleniyor ve ADMIN değilse, unitId olmalı
  if (data.role && data.role !== UserRole.ADMIN && !data.unitId) {
    return false;
  }
  return true;
}, {
  message: "Admin olmayan kullanıcılar için birim seçimi zorunludur",
  path: ["unitId"]
});

// GET /api/user - Tüm kullanıcıları getir veya id ile tek kullanıcı getir
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (id) {
      const user = await getUserById(id);
      if (!user) {
        return NextResponse.json(
          { error: "Kullanıcı bulunamadı" },
          { 
            status: 404,
            headers: {
              'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
            }
          }
        );
      }
      return NextResponse.json(user, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      });
    }
    const users = await getAllUsers();
    return NextResponse.json(users, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

// POST /api/user - Yeni kullanıcı oluştur
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: parsed.error.issues },
        { status: 400 },
      );
    }
    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(parsed.data.password!, 10);
    const user = await createUser({
      ...parsed.data,
      password: hashedPassword,
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

// PUT /api/user?id=... - Kullanıcı güncelle
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }
    const body = await req.json();
    const parsed = updateUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: parsed.error.issues },
        { status: 400 },
      );
    }
    let updateData = { ...parsed.data };
    // Şifre güncelleniyorsa hashle
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const updated = await updateUser(id, updateData);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

// DELETE /api/user?id=... - Kullanıcı sil
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }
    const deleted = await deleteUser(id);
    return NextResponse.json(deleted);
  } catch (error) {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
