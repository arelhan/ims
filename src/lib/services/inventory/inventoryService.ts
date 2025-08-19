import { prisma } from "../../prisma";
import { Inventory, InventoryStatus } from "@prisma/client";

// Tüm envanter öğelerini getir
export async function getAllInventory() {
  return prisma.inventory.findMany({
    include: {
      category: true,
      brand: true,
      assignedTo: true,
      decommissioned: true,
      serviceRecords: true,
      auditTrail: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

// ID ile envanter öğesi getir
export async function getInventoryById(id: string) {
  return prisma.inventory.findUnique({
    where: { id },
    include: {
      category: true,
      brand: true,
      assignedTo: true,
      decommissioned: true,
      serviceRecords: true,
      auditTrail: true,
    },
  });
}

// Atanmamış (Depoda) envanterleri getir
export async function getUnassignedInventory() {
  return prisma.inventory.findMany({
    where: { assignedToId: null, status: InventoryStatus.AVAILABLE },
    include: {
      category: true,
      brand: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Atanmış envanterleri getir
export async function getAssignedInventory() {
  return prisma.inventory.findMany({
    where: { assignedToId: { not: null }, status: InventoryStatus.ASSIGNED },
    include: {
      category: true,
      brand: true,
      assignedTo: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Product code oluştur
async function generateProductCode(categoryId: string): Promise<string> {
  // Kategori bilgisini al
  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  });
  
  if (!category) {
    throw new Error('Kategori bulunamadı');
  }
  
  // Bu kategorideki toplam ürün sayısını al
  const count = await prisma.inventory.count({
    where: { categoryId }
  });
  
  // 6 haneli benzersiz numara oluştur
  const uniqueNumber = (count + 1).toString().padStart(6, '0');
  
  return `${(category as any).code}-${uniqueNumber}`;
}

// Envanter oluştur
interface CreateInventoryData {
  name?: string; // Optional, ürün kodu kullanılacak
  description: string; // Zorunlu açıklama
  serialNumber?: string;
  categoryId: string;
  brandId: string;
  status?: InventoryStatus;
  assignedToId?: string | null;
  productCode?: string; // Otomatik oluşturulacak
  location?: string;
  purchaseDate?: Date;
  purchasePrice?: number;
  warrantyDate?: Date;
  supplier?: string;
  model?: string;
  specifications?: any;
  notes?: string;
  barcode?: string;
  condition?: string;
}

export async function createInventory(data: CreateInventoryData) {
  // Benzersiz ürün kodu oluştur
  const productCode = await generateProductCode(data.categoryId);
  
  return prisma.inventory.create({
    data: {
      ...data,
      name: data.name || productCode, // Name yoksa productCode kullan
      productCode: productCode,
    } as any,
    include: {
      category: true,
      brand: true,
      assignedTo: true,
    },
  });
}

// Envanter güncelle
export async function updateInventory(id: string, data: Partial<CreateInventoryData>) {
  return prisma.inventory.update({
    where: { id },
    data,
    include: {
      category: true,
      brand: true,
      assignedTo: true,
    },
  });
}

// Envanter sil (hizmet dışı bırak)
export async function deleteInventory(id: string) {
  // Önce DECOMMISSIONED durumuna getir, assignedTo'yu temizle
  const updated = await prisma.inventory.update({
    where: { id },
    data: {
      status: InventoryStatus.DECOMMISSIONED,
      assignedToId: null,
    },
  });

  return updated;
}

// Kullanıcıya envanter ata
export async function assignInventoryToUser(id: string, userId: string) {
  return prisma.inventory.update({
    where: { id },
    data: {
      assignedToId: userId,
      status: InventoryStatus.ASSIGNED,
    },
    include: {
      category: true,
      brand: true,
      assignedTo: true,
    },
  });
}

// Envanteri geri al (depoya koy)
export async function unassignInventory(id: string) {
  return prisma.inventory.update({
    where: { id },
    data: {
      assignedToId: null,
      status: InventoryStatus.AVAILABLE,
    },
    include: {
      category: true,
      brand: true,
    },
  });
}
