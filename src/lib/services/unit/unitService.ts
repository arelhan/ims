import { prisma } from "../../prisma";
import { Unit } from "@prisma/client";

// Tüm birimleri getir
export async function getAllUnits(): Promise<Unit[]> {
  return prisma.unit.findMany({
    include: {
      users: true,
    },
    orderBy: { name: "asc" },
  });
}

// ID ile birim getir
export async function getUnitById(id: string): Promise<Unit | null> {
  return prisma.unit.findUnique({
    where: { id },
    include: {
      users: true,
    },
  });
}

// Birim oluştur
export async function createUnit(data: { name: string }): Promise<Unit> {
  return prisma.unit.create({
    data: {
      name: data.name,
    },
  });
}

// Birim güncelle
export async function updateUnit(
  id: string,
  data: Partial<{ name: string }>
): Promise<Unit> {
  return prisma.unit.update({
    where: { id },
    data,
  });
}

// Birim sil
export async function deleteUnit(id: string): Promise<Unit> {
  return prisma.unit.delete({
    where: { id },
  });
}
