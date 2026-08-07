import type { Response } from "express";
import { RecipeModel } from "../models/Recipe.js";
import { ExerciseModel } from "../models/Exercise.js";
import { TipModel } from "../models/Tip.js";
import type { AuthedRequest } from "../middleware/auth.js";

export async function listRecipes(
  _req: AuthedRequest,
  res: Response
): Promise<void> {
  const recipes = await RecipeModel.find().sort({ title: 1 });
  res.json({ recipes });
}

export async function getRecipe(
  req: AuthedRequest,
  res: Response
): Promise<void> {
  const recipe = await RecipeModel.findById(req.params.id);
  if (!recipe) {
    res.status(404).json({ error: "Receta no encontrada" });
    return;
  }
  res.json({ recipe });
}

export async function listExercises(
  _req: AuthedRequest,
  res: Response
): Promise<void> {
  const exercises = await ExerciseModel.find().sort({ name: 1 });
  res.json({ exercises });
}

export async function getExercise(
  req: AuthedRequest,
  res: Response
): Promise<void> {
  const exercise = await ExerciseModel.findById(req.params.id);
  if (!exercise) {
    res.status(404).json({ error: "Ejercicio no encontrado" });
    return;
  }
  res.json({ exercise });
}

export async function listTips(
  _req: AuthedRequest,
  res: Response
): Promise<void> {
  const tips = await TipModel.find().sort({ title: 1 });
  res.json({ tips });
}

export async function getTip(
  req: AuthedRequest,
  res: Response
): Promise<void> {
  const tip = await TipModel.findById(req.params.id);
  if (!tip) {
    res.status(404).json({ error: "Consejo no encontrado" });
    return;
  }
  res.json({ tip });
}
