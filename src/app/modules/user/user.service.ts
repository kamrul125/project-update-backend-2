import { prisma } from "../../../config/prisma";

const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found!");
  }

  return user;
};

const getAllUsers = async (page = 1, limit = 20, role?: string) => {
  const where: any = {};
  if (role) where.role = role;

  const total = await prisma.user.count({ where });
  const currentPage = page;
  const totalPages = Math.ceil(total / limit);

  const users = await prisma.user.findMany({
    where,
    skip: (currentPage - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return {
    users,
    total,
    totalPages,
    currentPage,
  };
};

export const userService = {
  getMyProfile,
  getAllUsers,
};