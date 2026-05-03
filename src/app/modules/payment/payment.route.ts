import { Router } from "express";
import * as paymentController from "./payment.controller";
import protect from "../../../middlewares/auth.middleware";

const router = Router();

// পেমেন্ট শুরু (POST)
router.post("/purchase-idea", protect(), paymentController.handlePurchaseIdea);

// এক্সেস চেক (GET)
router.get("/access/:ideaId", protect(), paymentController.handleCheckAccess);

// SSL হ্যান্ডলার (এগুলো সাধারণত POST হয়)
router.post("/success/:tranId", paymentController.handleSuccess);
router.post("/fail/:tranId", paymentController.handleFail);

export default router;