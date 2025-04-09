import express from "express";
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
} from "../controllers/complaintController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create complaint (optional: protect route if needed)
router.post("/",protect, createComplaint);

// Get all relevant complaints (based on role)
router.get("/", protect, getComplaints);

// Admin-only deletion and full complaint access by ID
router
  .route("/:id")
  .get(protect, getComplaintById)
  .put(protect, updateComplaint)
  .delete(protect, admin, deleteComplaint);

export default router;
