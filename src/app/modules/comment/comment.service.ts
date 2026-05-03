import { prisma } from "../../../config/prisma";

/**
 * ১. কমেন্ট বা রিপ্লাই তৈরি করা
 */
export const createComment = async (
  userId: string, 
  ideaId: string, 
  content: string, 
  parentId?: string
) => {
  // যদি রিপ্লাই হয়, তবে চেক করা হচ্ছে ওই মেইন কমেন্টটি ডাটাবেসে আছে কি না
  if (parentId) {
    const parentComment = await prisma.comment.findUnique({
      where: { id: parentId }
    });

    if (!parentComment) {
      throw new Error("Parent comment not found!");
    }
    
    // চেক করা হচ্ছে রিপ্লাইটি কি একই আইডিয়াতে হচ্ছে কি না
    if (parentComment.ideaId !== ideaId) {
      throw new Error("Mismatch: This parent comment belongs to another idea!");
    }
  }

  return await prisma.comment.create({
    data: {
      content,
      userId,
      ideaId,
      parentId: parentId || null, 
    },
    include: {
      user: { select: { id: true, name: true } },
    },
  });
};

/**
 * ২. একটি আইডিয়ার সব কমেন্ট দেখা (রিপ্লাইসহ)
 */
export const getCommentsByIdea = async (ideaId: string) => {
  const ideaExists = await prisma.idea.findUnique({
    where: { id: ideaId }
  });

  if (!ideaExists) {
    throw new Error("Idea not found!");
  }

  return await prisma.comment.findMany({
    where: { 
      ideaId,
      parentId: null // শুধুমাত্র মেইন কমেন্টগুলো
    },
    include: {
      user: { select: { id: true, name: true } },
      replies: {
        include: {
          user: { select: { id: true, name: true } }
        },
        orderBy: { createdAt: "asc" }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};

/**
 * ৩. কমেন্ট ডিলিট করা
 * এখানে চেক করা হচ্ছে কমেন্টটি আসলে আছে কি না এবং ইউজার তার নিজের কমেন্ট ডিলিট করছে কি না।
 */
export const deleteComment = async (userId: string, commentId: string) => {
  // কমেন্টটি খুঁজে দেখা
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new Error("Comment not found!");
  }

  // মালিকানা যাচাই (নিজের কমেন্ট ছাড়া অন্য কেউ ডিলিট করতে পারবে না)
  if (comment.userId !== userId) {
    throw new Error("You are not authorized to delete this comment!");
  }

  // ডিলিট করা (Schema-তে Cascade থাকায় রিপ্লাইগুলোও ডিলিট হয়ে যাবে)
  return await prisma.comment.delete({
    where: { id: commentId },
  });
};

/**
 * ৪. কমেন্ট আপডেট করা
 */
export const updateComment = async (userId: string, commentId: string, content: string) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new Error("Comment not found!");
  }

  if (comment.userId !== userId) {
    throw new Error("You are not authorized to update this comment!");
  }

  return await prisma.comment.update({
    where: { id: commentId },
    data: { content },
  });
};