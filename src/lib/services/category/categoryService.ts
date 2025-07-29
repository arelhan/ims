import { prisma } from "../../prisma";
import { Category } from "@prisma/client";

// Tüm kategorileri getir
export async function getAllCategories(): Promise<Category[]> {
  return prisma.category.findMany({
    include: {
      assets: true,
    },
    orderBy: { name: "asc" },
  });
}

// ID ile kategori getir
export async function getCategoryById(id: string): Promise<Category | null> {
  return prisma.category.findUnique({
    where: { id },
    include: {
      assets: true,
    },
  });
}

// Kategori oluştur
export async function createCategory(data: { name: string; code?: string }): Promise<Category> {
  // Eğer code verilmemişse, name'den otomatik generate et
  const code = data.code || generateCategoryCode(data.name);
  
  return prisma.category.create({
    data: {
      name: data.name,
      code: code,
    },
  });
}

// Kategori adından kod üret
function generateCategoryCode(name: string): string {
  // Basit kod üretme algoritması:
  // 1. Türkçe karakterleri dönüştür
  const turkishMap: { [key: string]: string } = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
  };
  
  let normalized = name;
  for (const [turkish, english] of Object.entries(turkishMap)) {
    normalized = normalized.replace(new RegExp(turkish, 'g'), english);
  }
  
  // 2. Sadece harfleri al, büyük harfe çevir
  const letters = normalized.replace(/[^a-zA-Z]/g, '').toUpperCase();
  
  // 3. İlk 3 harfi al, yetersizse A ile doldur
  if (letters.length >= 3) {
    return letters.substring(0, 3);
  } else {
    return (letters + 'AAA').substring(0, 3);
  }
}

// Kategori güncelle
export async function updateCategory(
  id: string,
  data: Partial<{ name: string }>
): Promise<Category> {
  return prisma.category.update({
    where: { id },
    data,
  });
}

// Kategori sil
export async function deleteCategory(id: string): Promise<Category> {
  return prisma.category.delete({
    where: { id },
  });
}
