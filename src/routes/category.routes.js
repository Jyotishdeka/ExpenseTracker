import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
  getCategoryById,
} from "../controllers/category.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();

//secured routes
router.route("/").get(verifyJwt, getAllCategories);
router.route("/create-category").post(verifyJwt, createCategory);
router.route("/update-category/:id").put(verifyJwt, updateCategory);
router.route("/delete-category/:id").delete(verifyJwt, deleteCategory);
router.route("/get-category/:id").get(verifyJwt, getCategoryById);

export default router;
