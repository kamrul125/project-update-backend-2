import { Router } from "express";
import * as ideaController from "./idea.controller";
import protect from "../../../middlewares/auth.middleware";

const router = Router();

// ১. Public Routes
router.get("/", ideaController.getAllIdeas); 
router.get("/:id", ideaController.getIdeaById);

// ২. User Protected Routes
router.post("/", protect(), ideaController.createIdea);
router.put("/:id", protect(), ideaController.updateIdea);

// ৩. Admin Specific Routes (Must be above generic :id routes if conflicts occur)
router.patch("/approve/:id", protect("ADMIN"), ideaController.approveIdea);
router.patch("/reject/:id", protect("ADMIN"), ideaController.rejectIdea);

// ৪. Delete Route (Placed at the bottom to avoid prefix conflicts)
router.delete("/:id", protect(), ideaController.deleteIdea);

export default router;