// routes/productRoutes.js
import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getSellerProducts,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductsByCategory,
  searchProducts
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(protect, upload.array("images", 12), createProduct);
  router.route("/getproducts").get(getProducts)

  router.get("/search", searchProducts); 


router.route("/seller").get(protect, getSellerProducts);
router
  .route("/:id")
  .get(getProductById)
  .put(protect, upload.array("images", 12), updateProduct)
  .delete(protect, deleteProduct);
  router.get("/getproductsbycategory/:category", getProductsByCategory);

 

export default router;
