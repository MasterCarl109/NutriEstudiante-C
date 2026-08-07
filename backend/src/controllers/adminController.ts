import type { Response } from "express";
import { RecipeModel } from "../models/Recipe.js";
import { ExerciseModel } from "../models/Exercise.js";
import { TipModel } from "../models/Tip.js";
import type { AuthedRequest } from "../middleware/auth.js";

function pickRecipe(body: Record<string, unknown>) {
  const {
    title,
    description,
    ingredients,
    instructions,
    nutrition,
    category,
    suitableFor,
    image,
  } = body;
  return {
    title,
    description,
    ingredients: Array.isArray(ingredients)
      ? ingredients.map((i) => String(i).trim()).filter(Boolean)
      : [],
    instructions: Array.isArray(instructions)
      ? instructions.map((i) => String(i).trim()).filter(Boolean)
      : [],
    nutrition: nutrition && typeof nutrition === "object"
      ? {
          calories: Number((nutrition as Record<string, unknown>).calories) || 0,
          protein: Number((nutrition as Record<string, unknown>).protein) || 0,
          carbs: Number((nutrition as Record<string, unknown>).carbs) || 0,
          fat: Number((nutrition as Record<string, unknown>).fat) || 0,
        }
      : undefined,
    category,
    suitableFor: Array.isArray(suitableFor)
      ? suitableFor.map((s) => String(s))
      : [],
    image: image ?? "",
  };
}

export async function createRecipe(
  req: AuthedRequest,
  res: Response
): Promise<void> {
  if (!req.body.title) {
    res.status(400).json({ error: "El título es obligatorio" });
    return;
  }
  const recipe = await RecipeModel.create(pickRecipe(req.body));
  res.status(201).json({ recipe });
}

export async function updateRecipe(
  req: AuthedRequest,
  res: Response
): Promise<void> {
  const recipe = await RecipeModel.findByIdAndUpdate(
    req.params.id,
    pickRecipe(req.body),
    { new: true, runValidators: true }
  );
  if (!recipe) {
    res.status(404).json({ error: "Receta no encontrada" });
    return;
  }
  res.json({ recipe });
}

export async function deleteRecipe(
  req: AuthedRequest,
  res: Response
): Promise<void> {
  const recipe = await RecipeModel.findByIdAndDelete(req.params.id);
  if (!recipe) {
    res.status(404).json({ error: "Receta no encontrada" });
    return;
  }
  res.json({ message: "Receta eliminada" });
}

function pickExercise(body: Record<string, unknown>) {
  const { name, description, duration, difficulty, goal, instructions } = body;
  return {
    name,
    description,
    duration,
    difficulty,
    goal,
    instructions: Array.isArray(instructions)
      ? instructions.map((i) => String(i).trim()).filter(Boolean)
      : [],
  };
}

export async function createExercise(
  req: AuthedRequest,
  res: Response
): Promise<void> {
  if (!req.body.name) {
    res.status(400).json({ error: "El nombre es obligatorio" });
    return;
  }
  const exercise = await ExerciseModel.create(pickExercise(req.body));
  res.status(201).json({ exercise });
}

export async function updateExercise(
  req: AuthedRequest,
  res: Response
): Promise<void> {
  const exercise = await ExerciseModel.findByIdAndUpdate(
    req.params.id,
    pickExercise(req.body),
    { new: true, runValidators: true }
  );
  if (!exercise) {
    res.status(404).json({ error: "Ejercicio no encontrado" });
    return;
  }
  res.json({ exercise });
}

export async function deleteExercise(
  req: AuthedRequest,
  res: Response
): Promise<void> {
  const exercise = await ExerciseModel.findByIdAndDelete(req.params.id);
  if (!exercise) {
    res.status(404).json({ error: "Ejercicio no encontrado" });
    return;
  }
  res.json({ message: "Ejercicio eliminado" });
}

function pickTip(body: Record<string, unknown>) {
  const { title, content } = body;
  return { title, content };
}

export async function createTip(
  req: AuthedRequest,
  res: Response
): Promise<void> {
  if (!req.body.title || !req.body.content) {
    res.status(400).json({ error: "Título y contenido son obligatorios" });
    return;
  }
  const tip = await TipModel.create(pickTip(req.body));
  res.status(201).json({ tip });
}

export async function updateTip(
  req: AuthedRequest,
  res: Response
): Promise<void> {
  const tip = await TipModel.findByIdAndUpdate(req.params.id, pickTip(req.body), {
    new: true,
    runValidators: true,
  });
  if (!tip) {
    res.status(404).json({ error: "Consejo no encontrado" });
    return;
  }
  res.json({ tip });
}

export async function deleteTip(
  req: AuthedRequest,
  res: Response
): Promise<void> {
  const tip = await TipModel.findByIdAndDelete(req.params.id);
  if (!tip) {
    res.status(404).json({ error: "Consejo no encontrado" });
    return;
  }
  res.json({ message: "Consejo eliminado" });
}
