import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getBmi } from "../controllers/bmiController.js";

const router = Router();

router.get("/", requireAuth, getBmi);

export default router;
