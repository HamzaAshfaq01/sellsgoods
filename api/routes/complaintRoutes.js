import express from "express";
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
} from "../controllers/complaintController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/",protect, upload.array("images", 5),  createComplaint);


router.get("/", protect, getComplaints);

router
  .route("/:id")
  .get(protect, getComplaintById)
  .put(protect, updateComplaint)
  .delete(protect, admin, deleteComplaint);

export default router;
