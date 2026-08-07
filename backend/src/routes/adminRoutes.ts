import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { validateImage } from "../middleware/validateImage.js";
import {
  createRecipe,
  updateRecipe,
  deleteRecipe,
  createExercise,
  updateExercise,
  deleteExercise,
  createTip,
  updateTip,
  deleteTip,
} from "../controllers/adminController.js";

const router = Router();

router.use(requireAuth, requireAdmin);

router.post("/recipes", validateImage, createRecipe);
router.put("/recipes/:id", validateImage, updateRecipe);
router.delete("/recipes/:id", deleteRecipe);

router.post("/exercises", createExercise);
router.put("/exercises/:id", updateExercise);
router.delete("/exercises/:id", deleteExercise);

router.post("/tips", createTip);
router.put("/tips/:id", updateTip);
router.delete("/tips/:id", deleteTip);

export default router;
