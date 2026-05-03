import { prisma } from "../../../config/prisma";


export const createCategory = async (name: string, userId: string, role: string) => {
  
  return await prisma.category.create({
    data: { name },
  });
};

export const getAllCategories = async () => {
  return await prisma.category.findMany({
    include: {
      _count: {
        select: { ideas: true } 
      }
    }
  });
};