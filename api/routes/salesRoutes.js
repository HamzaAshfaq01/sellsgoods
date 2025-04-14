import express from "express";
import { getSales } from "../controllers/salesController.js";
const router = express.Router();

router.get("/", (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store'); 
    next();
  }, getSales);

export default router;
