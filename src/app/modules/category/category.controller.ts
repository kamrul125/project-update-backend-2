import { Request, Response } from "express";
import * as categoryService from "./category.service";
import catchAsync from "../../../utils/catchAsync";

// Create Category (Admin only)
export const createCategory = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.body;
  
 
  const user = (req as any).user; 

 
  const category = await categoryService.createCategory(
    name, 
    user.id as string, 
    user.role as string
  );

  res.status(201).json({
    status: "success",
    message: "Category created successfully",
    data: category,
  });
});

// Get All Categories
export const getCategories = catchAsync(async (req: Request, res: Response) => {
  // সার্ভিস ফাইলের 'getAllCategories' কল করা হচ্ছে
  const categories = await categoryService.getAllCategories();

  res.status(200).json({
    status: "success",
    results: categories.length,
    data: categories,
  });
});