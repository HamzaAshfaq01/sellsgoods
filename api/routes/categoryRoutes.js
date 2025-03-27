import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getListingCategories
} from "../controllers/categoryController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/listingCategories", getListingCategories);

router.route("/").get(getAllCategories).post(protect, admin, createCategory);

router
  .route("/:id")
  .get(getCategoryById)
  .put(protect, admin, updateCategory)
  .delete(protect, admin, deleteCategory);

export default router;
