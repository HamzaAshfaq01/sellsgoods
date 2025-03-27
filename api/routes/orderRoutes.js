import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js"
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(createOrder).get(protect, getOrders);
router
  .route("/:id")
  .get(protect, getOrderById)
  .put( updateOrder)
  .delete(protect, admin, deleteOrder);

export default router;
