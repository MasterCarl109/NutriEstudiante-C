import { Schema, model, type Model, type InferSchemaType } from "mongoose";

const recipeSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
      maxlength: [120, "El título no puede superar 120 caracteres"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [600, "La descripción no puede superar 600 caracteres"],
    },
    ingredients: {
      type: [String],
      default: [],
    },
    instructions: {
      type: [String],
      default: [],
    },
    nutrition: {
      calories: { type: Number, min: 0 },
      protein: { type: Number, min: 0 },
      carbs: { type: Number, min: 0 },
      fat: { type: Number, min: 0 },
    },
    category: {
      type: String,
      enum: {
        values: ["desayuno", "almuerzo", "cena", "snack", "batido", "postre"],
        message: "Categoría inválida",
      },
      default: "almuerzo",
    },
    suitableFor: {
      type: [String],
      enum: {
        values: ["underweight", "normal", "overweight", "obesity"],
        message: "Recomendación inválida",
      },
      default: [],
    },
    image: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

export type Recipe = InferSchemaType<typeof recipeSchema>;

export const RecipeModel: Model<Recipe> = model<Recipe>("Recipe", recipeSchema);
