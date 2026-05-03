import { Request, Response } from "express";
import * as paymentService from "./payment.service";
import catchAsync from "../../../utils/catchAsync";

/**
 * ১. পেমেন্ট লিঙ্ক জেনারেট করা (POST)
 */
export const handlePurchaseIdea = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { ideaId } = req.body;

  // userId এবং ideaId নিশ্চিতভাবে string হিসেবে পাঠানো হচ্ছে
  const paymentUrl = await paymentService.purchaseIdea(String(user.id), ideaId as string);

  res.status(200).json({
    success: true,
    message: "Payment link generated",
    data: paymentUrl,
  });
});

/**
 * ২. পেমেন্ট সফল হলে (POST - SSLCommerz থেকে কল আসে)
 */
export const handleSuccess = catchAsync(async (req: Request, res: Response) => {
  // টাইপস্ক্রিপ্ট এরর ফিক্স করতে 'as string' ব্যবহার করা হয়েছে ✅
  const tranId = req.params.tranId as string;

  // ডাটাবেসে পেমেন্ট স্ট্যাটাস PAID করে দেওয়া হচ্ছে
  await paymentService.fulfillPayment(tranId);

  // সফল হলে ফ্রন্টএন্ডের সাকসেস পেজে পাঠিয়ে দেওয়া
  res.redirect(`http://localhost:3000/purchase/success?transactionId=${tranId}`);
});

/**
 * ৩. পেমেন্ট ব্যর্থ হলে (POST)
 */
export const handleFail = catchAsync(async (req: Request, res: Response) => {
  res.redirect(`http://localhost:3000/purchase/fail`);
});

/**
 * ৪. আইডিয়া এক্সেস চেক করা (GET)
 */
export const handleCheckAccess = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { ideaId } = req.params;

  // ideaId কে string হিসেবে কাস্ট করা হয়েছে
  const hasAccess = await paymentService.checkAccess(String(user.id), ideaId as string);

  res.status(200).json({
    success: true,
    message: hasAccess ? "Access granted" : "Access denied. Please purchase.",
    data: {
      hasAccess,
    },
  });
});