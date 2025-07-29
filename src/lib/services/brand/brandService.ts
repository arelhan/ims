import { prisma } from "../../prisma";
import { Brand } from "@prisma/client";

// Tüm markaları getir
export async function getAllBrands(): Promise<Brand[]> {
  return prisma.brand.findMany({
    include: {
      assets: true,
    },
    orderBy: { name: "asc" },
  });
}

// ID ile marka getir
export async function getBrandById(id: string): Promise<Brand | null> {
  return prisma.brand.findUnique({
    where: { id },
    include: {
      assets: true,
    },
  });
}

// Marka oluştur
export async function createBrand(data: { name: string }): Promise<Brand> {
  return prisma.brand.create({
    data: {
      name: data.name,
    },
  });
}

// Marka güncelle
export async function updateBrand(
  id: string,
  data: Partial<{ name: string }>
): Promise<Brand> {
  return prisma.brand.update({
    where: { id },
    data,
  });
}

// Marka sil
export async function deleteBrand(id: string): Promise<Brand> {
  return prisma.brand.delete({
    where: { id },
  });
}
