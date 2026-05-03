import { Request, Response } from "express";
import * as voteService from "./vote.service";
import catchAsync from "../../../utils/catchAsync";
import { VoteType } from "@prisma/client";

// নিশ্চিত করুন এখানে export const handleVote আছে
export const handleVote = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const ideaId = req.params.ideaId as string;
  const rawType = req.body.type as string | undefined;

  const type = rawType === "DOWNVOTE" ? VoteType.DOWNVOTE : VoteType.UPVOTE;

  const result = await voteService.voteIdea(
    String(user.id),
    ideaId,
    type
  );

  res.status(200).json({
    success: true,
    message: "Vote processed successfully",
    data: result,
  });
});

// নিশ্চিত করুন এখানে export const getIdeaVotes আছে
export const getIdeaVotes = catchAsync(async (req: Request, res: Response) => {
  const ideaId = req.params.ideaId as string;

  const result = await voteService.getVotesCount(ideaId);

  res.status(200).json({
    success: true,
    message: "Votes count fetched successfully",
    data: result
  });
});