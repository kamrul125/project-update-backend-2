import { Router } from "express";
import authRoutes from "../app/modules/auth/auth.route";
import ideaRoutes from "../app/modules/idea/idea.route";
import categoryRoutes from "../app/modules/category/category.route";
import voteRoutes from "../app/modules/vote/vote.route";
import paymentRoutes from "../app/modules/payment/payment.route";
import commentRoutes from "../app/modules/comment/comment.route";
import userRoutes from "../app/modules/user/user.route";
import dashboardRoutes from "../app/modules/dashboard/dashboard.route";
import aiRoutes from "../app/modules/ai/ai.route";

const router = Router();

const moduleRoutes = [
  { path: "/auth", route: authRoutes },
  { path: "/users", route: userRoutes },
  { path: "/ideas", route: ideaRoutes },
  { path: "/categories", route: categoryRoutes },
  { path: "/votes", route: voteRoutes },
  { path: "/payments", route: paymentRoutes },
  { path: "/comments", route: commentRoutes },
  { path: "/dashboard", route: dashboardRoutes },
  { path: "/ai", route: aiRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;