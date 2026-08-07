import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { updateProfile, changePassword } from "../controllers/profileController.js";

const router = Router();

router.put("/", requireAuth, updateProfile);
router.put("/password", requireAuth, changePassword);

export default router;
