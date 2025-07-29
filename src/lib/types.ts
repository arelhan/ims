export enum InventoryStatus {
  AVAILABLE = "AVAILABLE",
  ASSIGNED = "ASSIGNED",
  DECOMMISSIONED = "DECOMMISSIONED",
  IN_SERVICE = "IN_SERVICE",
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface Unit {
  id: string;
  name: string;
  users?: User[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  unit?: Unit;
  unitId?: string;
  assets?: Inventory[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  assets?: Inventory[];
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  name: string;
  assets?: Inventory[];
  createdAt: string;
  updatedAt: string;
}

export interface Inventory {
  id: string;
  name: string;
  description?: string;
  serialNumber?: string;
  status: InventoryStatus;
  category: Category;
  categoryId: string;
  brand: Brand;
  brandId: string;
  assignedTo?: User;
  assignedToId?: string;
  decommissioned?: Decommissioned;
  serviceRecords?: ServiceRecord[];
  auditTrail?: AuditTrail[];
  createdAt: string;
  updatedAt: string;
}

export interface Decommissioned {
  id: string;
  inventory: Inventory;
  inventoryId: string;
  reason?: string;
  date: string;
}

export interface ServiceRecord {
  id: string;
  inventory: Inventory;
  inventoryId: string;
  description: string;
  date: string;
}

export interface AuditTrail {
  id: string;
  inventory: Inventory;
  inventoryId: string;
  action: string;
  performedBy: string;
  date: string;
}
