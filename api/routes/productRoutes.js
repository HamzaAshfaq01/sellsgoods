// routes/productRoutes.js
import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getSellerProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(protect, upload.array("images", 12), createProduct);

router.route("/seller").get(protect, getSellerProducts);
router
  .route("/:id")
  .get(getProductById)
  .put(protect, upload.array("images", 12), updateProduct)
  .delete(protect, deleteProduct);

export default router;
