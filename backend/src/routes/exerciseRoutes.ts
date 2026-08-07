import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  listExercises,
  getExercise,
} from "../controllers/contentController.js";

const router = Router();

router.get("/", requireAuth, listExercises);
router.get("/:id", requireAuth, getExercise);

export default router;
