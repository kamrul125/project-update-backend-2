import { Router } from "express";
// Namespace import ব্যবহার করা হয়েছে যাতে 'no exported member' এরর না আসে
import * as userController from "./user.controller";
import auth from "../../../middlewares/auth.middleware";

const router = Router();

/**
 * @route   GET /api/v1/users/me
 * @desc    লগইন করা ইউজারের নিজের প্রোফাইল দেখা
 * @access  Private (USER, ADMIN both)
 */
router.get(
  "/me", 
  auth(), // এখানে কোনো রোল না দিলে লগইন করা যে কেউ (USER/ADMIN) এক্সেস পাবে ✅
  userController.getMe
);

/**
 * @route   GET /api/v1/users/all-users
 * @desc    সব ইউজারের লিস্ট দেখা
 * @access  Private (Only ADMIN)
 */
router.get(
  "/all-users", 
  auth("ADMIN"), // এখানে শুধু ADMIN এক্সেস পাবে
  userController.getAllUsers
);

export default router;