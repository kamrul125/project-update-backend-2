import { Router } from "express";
import * as commentController from "./comment.controller";
import protect from "../../../middlewares/auth.middleware";

const router = Router();

// নতুন কমেন্ট বা রিপ্লাই
router.post("/:ideaId", protect(), commentController.handleCreateComment);

// আইডিয়ার সব কমেন্ট দেখা
router.get("/:ideaId", commentController.fetchIdeaComments);

// কমেন্ট ডিলিট করা (এখানে :commentId প্যারামিটার হিসেবে যাচ্ছে)
router.delete("/:commentId", protect(), commentController.handleDeleteComment);

// কমেন্ট আপডেট করা
router.patch("/:commentId", protect(), commentController.handleUpdateComment);

export default router;