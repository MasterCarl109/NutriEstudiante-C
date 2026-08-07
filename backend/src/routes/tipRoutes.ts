import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { listTips, getTip } from "../controllers/contentController.js";

const router = Router();

router.get("/", requireAuth, listTips);
router.get("/:id", requireAuth, getTip);

export default router;
