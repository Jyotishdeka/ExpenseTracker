import { Router } from "express";
import {
  createBudget,
  getAllBudgets,
  getBudgetById,
  updateBudget,
  deleteBudgetById,
  getBudgetsByCategory
} from "../controllers/budget.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").get(verifyJwt, getAllBudgets);
router.route("/create-budget").post(verifyJwt, createBudget);
router.route("/:id").get(verifyJwt, getBudgetById);
router.route("/update-budget/:id").put(verifyJwt, updateBudget);
router.route("/delete-budget/:id").delete(verifyJwt, deleteBudgetById);
router.route("/category/:id").get(verifyJwt, getBudgetsByCategory);



export default router;
