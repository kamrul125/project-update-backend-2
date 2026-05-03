import { Router } from "express";
import * as categoryController from "./category.controller";
import protect from "../../../middlewares/auth.middleware";


const router = Router();


router.get("/", categoryController.getCategories);


router.post(
  "/", 
  protect("ADMIN"), 
  categoryController.createCategory
);

export default router;