import { Schema, model, type Model, type InferSchemaType } from "mongoose";

const exerciseSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      maxlength: [120, "El nombre no puede superar 120 caracteres"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [600, "La descripción no puede superar 600 caracteres"],
    },
    duration: {
      type: String,
      trim: true,
      default: "",
    },
    difficulty: {
      type: String,
      enum: {
        values: ["baja", "media", "alta"],
        message: "Dificultad inválida",
      },
      default: "media",
    },
    goal: {
      type: String,
      enum: {
        values: ["cardio", "fuerza", "movilidad", "resistencia", "equilibrio"],
        message: "Objetivo inválido",
      },
      default: "cardio",
    },
    instructions: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export type Exercise = InferSchemaType<typeof exerciseSchema>;

export const ExerciseModel: Model<Exercise> = model<Exercise>(
  "Exercise",
  exerciseSchema
);
