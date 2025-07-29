import { prisma } from "../../prisma";
import { User, UserRole } from "@prisma/client";

export async function getAllUsers(): Promise<User[]> {
  return prisma.user.findMany({
    include: {
      unit: true,
      assets: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
    include: {
      unit: true,
      assets: true,
    },
  });
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
    include: {
      unit: true,
      assets: true,
    },
  });
}

export async function createUser(data: {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
  unitId?: string;
}): Promise<User> {
  return prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role ?? UserRole.USER,
      unitId: data.unitId,
    },
  });
}

export async function updateUser(
  id: string,
  data: Partial<{
    email: string;
    password: string;
    name: string;
    role: UserRole;
    unitId: string | null;
  }>
): Promise<User> {
  return prisma.user.update({
    where: { id },
    data,
  });
}

export async function deleteUser(id: string): Promise<User> {
  return prisma.user.delete({
    where: { id },
  });
}
