import { Request, Response } from "express";
import * as commentService from "./comment.service";
import catchAsync from "../../../utils/catchAsync";
import { createCommentSchema, updateCommentSchema } from "./comment.validation";

/**
 * ১. কমেন্ট বা রিপ্লাই তৈরি করা
 * POST: /api/v1/comments/:ideaId
 */
export const handleCreateComment = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const ideaId = req.params.ideaId as string;
  const { content, parentId } = createCommentSchema.parse(req.body);

  const result = await commentService.createComment(
    String(user.id),
    ideaId,
    content,
    parentId ? String(parentId) : undefined
  );

  res.status(201).json({
    success: true,
    message: parentId ? "Reply added successfully" : "Comment added successfully",
    data: result,
  });
});

/**
 * ২. একটি আইডিয়ার সব কমেন্ট ফেচ করা
 * GET: /api/v1/comments/:ideaId
 */
export const fetchIdeaComments = catchAsync(async (req: Request, res: Response) => {
  const ideaId = req.params.ideaId as string;
  const result = await commentService.getCommentsByIdea(ideaId);

  res.status(200).json({
    success: true,
    message: "Comments fetched successfully",
    data: result
  });
});

/**
 * ৩. কমেন্ট ডিলিট করা
 * DELETE: /api/v1/comments/:commentId
 */
export const handleDeleteComment = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const commentId = req.params.commentId as string;

  await commentService.deleteComment(String(user.id), commentId);

  res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
  });
});

/**
 * ৪. কমেন্ট আপডেট করা
 * PATCH: /api/v1/comments/:commentId
 */
export const handleUpdateComment = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const commentId = req.params.commentId as string;
  const { content } = updateCommentSchema.parse(req.body);

  const updatedComment = await commentService.updateComment(String(user.id), commentId, content);

  res.status(200).json({
    success: true,
    message: "Comment updated successfully",
    data: updatedComment,
  });
});