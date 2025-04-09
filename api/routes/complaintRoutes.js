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

router.post("/",protect, createComplaint);


router.get("/", protect, getComplaints);

router
  .route("/:id")
  .get(protect, getComplaintById)
  .put(protect, updateComplaint)
  .delete(protect, admin, deleteComplaint);

export default router;
