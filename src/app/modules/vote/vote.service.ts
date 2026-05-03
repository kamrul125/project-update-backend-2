import { prisma } from "../../../config/prisma";
import { VoteType } from "@prisma/client";

/**
 * ১. Vote Toggle Logic
 * একই টাইপ হলে ডিলিট হবে, ভিন্ন টাইপ হলে আপডেট হবে, না থাকলে ক্রিয়েট হবে।
 */
export const voteIdea = async (userId: string, ideaId: string, type: VoteType) => {
  const existingVote = await prisma.vote.findUnique({
    where: {
      userId_ideaId: { userId, ideaId },
    },
  });

  if (existingVote) {
    // যদি একই টাইপ হয় (UP -> UP), তবে রিমুভ
    if (existingVote.type === type) {
      await prisma.vote.delete({
        where: { userId_ideaId: { userId, ideaId } },
      });
      return { action: "REMOVED", message: "Vote removed" };
    }

    // যদি টাইপ আলাদা হয় (UP -> DOWN), তবে আপডেট
    return await prisma.vote.update({
      where: { userId_ideaId: { userId, ideaId } },
      data: { type },
    });
  }

  // নতুন ভোট তৈরি
  return await prisma.vote.create({
    data: { userId, ideaId, type },
  });
};

/**
 * ২. নির্দিষ্ট আইডিয়ার ভোটের সংখ্যা বের করা (Optimized with groupBy)
 */
export const getVotesCount = async (ideaId: string) => {
  const counts = await prisma.vote.groupBy({
    by: ['type'],
    where: { ideaId },
    _count: true,
  });

  // রেজাল্ট ফরম্যাট করা
  const result = { UPVOTE: 0, DOWNVOTE: 0 };
  counts.forEach((c) => {
    result[c.type as keyof typeof result] = c._count;
  });

  return result;
};