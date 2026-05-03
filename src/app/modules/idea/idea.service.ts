import { prisma } from '../../../config/prisma';

// ১. Create Idea
export const createIdea = async (userId: string, data: any) => {
  return await prisma.idea.create({
    data: {
      title: data.title,
      description: data.description,
      categoryId: data.categoryId, 
      authorId: userId,           
      status: "DRAFT",
      isPaid: data.isPaid || false,
      price: data.price || 0,
    },
    include: {
      category: true,
      author: { select: { name: true, email: true } }
    }
  });
};

// ২. Get All Ideas
export const getAllIdeas = async (filter?: any, orderBy?: any, skip?: number, take?: number) => {
  return await prisma.idea.findMany({
    where: filter,
    include: { 
      author: { select: { id: true, name: true, email: true, role: true } }, 
      category: true,
      _count: { select: { votes: true, comments: true } }
    },
    orderBy: orderBy || { createdAt: "desc" },
    skip,
    take,
  });
};

// ৩. Get Single Idea By ID
export const getIdeaById = async (id: string) => {
  return await prisma.idea.findUnique({
    where: { id },
    include: { 
      author: { select: { id: true, name: true, email: true } }, 
      category: true, 
      votes: true, 
      comments: {
        include: {
          user: { select: { name: true } },
          replies: true
        }
      }
    },
  });
};

// ৪. Update Idea (Owner Only & Draft Only)
export const updateIdea = async (userId: string, ideaId: string, data: any) => {
  const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
  if (!idea) throw new Error("Idea not found");
  if (idea.authorId !== userId) throw new Error("You are not authorized to edit this idea");
  if (idea.status !== "DRAFT") throw new Error("Cannot edit an idea after it has been reviewed or approved");

  return await prisma.idea.update({
    where: { id: ideaId },
    data: {
        title: data.title,
        description: data.description,
        price: data.price,
        isPaid: data.isPaid,
        categoryId: data.categoryId
    },
  });
};

// ৫. Delete Idea (Owner OR Admin)
export const deleteIdea = async (userId: string, userRole: string, ideaId: string) => {
  const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
  if (!idea) throw new Error("Idea not found");
  
  if (idea.authorId !== userId && userRole !== "ADMIN") {
    throw new Error("You do not have permission to delete this idea");
  }

  return await prisma.idea.delete({ where: { id: ideaId } });
};

// ৬. Admin: Approve Idea
export const approveIdea = async (ideaId: string) => {
  return await prisma.idea.update({
    where: { id: ideaId },
    data: { status: "APPROVED" },
  });
};

// ৭. Admin: Reject Idea with Feedback
export const rejectIdea = async (ideaId: string, feedback: string) => {
  const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
  if (!idea) throw new Error("Idea not found");

  return await prisma.idea.update({
    where: { id: ideaId },
    data: { 
      status: "REJECTED",
      description: `${idea.description}\n\n--- Admin Feedback ---\n${feedback}` 
    }, 
  });
};