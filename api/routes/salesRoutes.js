import express from "express";
import { getSales } from "../controllers/salesController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();


router.get("/", protect, getSales);

export default router;
