import express from "express";
import { processPayment } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/pay", processPayment);

export default router;