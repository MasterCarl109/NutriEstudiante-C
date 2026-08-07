import { Router } from "express";
import { register, login } from "../controllers/authController.js";
import { requireAuth, getProfile } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, getProfile);

export default router;
