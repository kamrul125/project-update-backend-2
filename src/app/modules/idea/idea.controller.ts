import { Request, Response } from "express";
import { prisma } from "../../../config/prisma";
import * as ideaService from "./idea.service";
import catchAsync from "../../../utils/catchAsync";
import { createIdeaSchema, updateIdeaSchema } from "./idea.validation";

export const createIdea = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const data = createIdeaSchema.parse(req.body);
  const result = await ideaService.createIdea(String(user.id), data);
  res.status(201).json({ success: true, message: "Idea created successfully", data: result });
});

export const getAllIdeas = catchAsync(async (req: Request, res: Response) => {
  const {
    search,
    category,
    sort = 'newest',
    page = '1',
    limit = '12',
    minVotes,
    fromDate,
    toDate,
  } = req.query;

  const filter: any = {};

  if (search) {
    filter.OR = [
      { title: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  if (category && category !== 'All') {
    filter.category = { name: category as string };
  }

  if (minVotes) {
    const voteCount = Number(minVotes);
    if (!Number.isNaN(voteCount)) {
      filter.votes = { _count: { gte: voteCount } };
    }
  }

  if (fromDate || toDate) {
    filter.createdAt = {};
    if (fromDate) filter.createdAt.gte = new Date(fromDate as string);
    if (toDate) filter.createdAt.lte = new Date(toDate as string);
  }

  let orderBy: any = { createdAt: 'desc' };
  switch (sort) {
    case 'oldest':
      orderBy = { createdAt: 'asc' };
      break;
    case 'most_voted':
      orderBy = [{ votes: { _count: 'desc' } }, { createdAt: 'desc' }];
      break;
    case 'least_voted':
      orderBy = [{ votes: { _count: 'asc' } }, { createdAt: 'desc' }];
      break;
    default:
      orderBy = { createdAt: 'desc' };
  }

  const pageNumber = Number(page);
  const pageSize = Number(limit);
  const skip = (pageNumber - 1) * pageSize;
  const take = pageSize;

  const [ideas, total] = await Promise.all([
    ideaService.getAllIdeas(filter, orderBy, skip, take),
    prisma.idea.count({ where: filter }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  res.status(200).json({
    success: true,
    message: 'Ideas fetched successfully',
    data: ideas,
    total,
    totalPages,
    currentPage: pageNumber,
  });
});

export const getIdeaById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ideaService.getIdeaById(id as string);
  if (!result) return res.status(404).json({ success: false, message: "Idea not found" });
  res.status(200).json({ success: true, message: "Idea fetched successfully", data: result });
});

export const updateIdea = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params;
  const data = updateIdeaSchema.parse(req.body);
  const result = await ideaService.updateIdea(String(user.id), id as string, data);
  res.status(200).json({ success: true, message: "Idea updated successfully", data: result });
});

export const deleteIdea = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params;
  await ideaService.deleteIdea(String(user.id), String(user.role), id as string);
  res.status(200).json({ success: true, message: "Idea deleted successfully" });
});

export const approveIdea = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ideaService.approveIdea(id as string);
  res.status(200).json({ success: true, message: "Idea approved successfully", data: result });
});

export const rejectIdea = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { feedback } = req.body;
  const result = await ideaService.rejectIdea(id as string, feedback);
  res.status(200).json({ success: true, message: "Idea rejected successfully", data: result });
});