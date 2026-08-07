import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { listRecipes, getRecipe } from "../controllers/contentController.js";

const router = Router();

router.get("/", requireAuth, listRecipes);
router.get("/:id", requireAuth, getRecipe);

export default router;
