import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/User.js";
import { RecipeModel } from "../models/Recipe.js";
import { ExerciseModel } from "../models/Exercise.js";
import { TipModel } from "../models/Tip.js";
import { config } from "../config/index.js";

async function seedAdmin(): Promise<void> {
  const exists = await UserModel.findOne({ email: config.adminEmail.toLowerCase() });

  if (exists) {
    if (exists.role !== "admin") {
      exists.role = "admin";
      await exists.save();
      console.log("Admin actualizado a rol admin");
    } else {
      console.log("Admin ya existe");
    }
    return;
  }

  const hashedPassword = await bcrypt.hash(config.adminPassword, 10);
  await UserModel.create({
    name: "Administrador",
    email: config.adminEmail,
    password: hashedPassword,
    role: "admin",
  });
  console.log(`Admin creado: ${config.adminEmail}`);
}

const RECIPES = [
  {
    title: "Avena con frutas y miel",
    description:
      "Un desayuno rápido, económico y nutritivo ideal para empezar el día con energía.",
    ingredients: [
      "1/2 taza de avena",
      "1 taza de leche o bebida vegetal",
      "1 plátano en rodajas",
      "1/2 taza de fresas",
      "1 cucharada de miel",
      "Canela al gusto",
    ],
    instructions: [
      "Calienta la leche en una olla a fuego medio.",
      "Agrega la avena y cocina 5 minutos removiendo.",
      "Sirve en un tazón y añade el plátano y las fresas.",
      "Cubre con miel y espolvorea canela.",
    ],
    nutrition: { calories: 380, protein: 12, carbs: 62, fat: 8 },
    image: "/uploads/toypendejo.jpg",
  },
  {
    title: "Ensalada de pollo con quinoa",
    description:
      "Almuerzo completo con proteína y carbohidratos complejos. Fácil de preparar.",
    ingredients: [
      "1 pechuga de pollo cocida y desmenuzada",
      "1 taza de quinoa cocida",
      "1 tomate en cubos",
      "1/2 pepino en rodajas",
      "Hojas verdes al gusto",
      "Jugo de limón y aceite de oliva",
    ],
    instructions: [
      "Mezcla la quinoa con el tomate, el pepino y las hojas verdes.",
      "Agrega el pollo desmenuzado.",
      "Aliña con limón, aceite de oliva y sal al gusto.",
    ],
    nutrition: { calories: 420, protein: 34, carbs: 40, fat: 12 },
    image: "",
  },
  {
    title: "Batido de plátano y espinaca",
    description:
      "Bebida refrescante para el desayuno o después de estudiar, rica en vitaminas.",
    ingredients: [
      "1 plátano maduro",
      "1 puñado de espinaca",
      "1 taza de leche o bebida vegetal",
      "1 cucharada de avena",
      "Hielo al gusto",
    ],
    instructions: [
      "Coloca todos los ingredientes en la licuadora.",
      "Licúa hasta obtener una mezcla homogénea.",
      "Sirve inmediatamente con hielo.",
    ],
    nutrition: { calories: 280, protein: 10, carbs: 50, fat: 4 },
    image: "",
  },
];

const EXERCISES = [
  {
    name: "Caminata rápida",
    description:
      "Actividad cardiovascular de bajo impacto, perfecta para empezar a moverse.",
    duration: "30 minutos",
    difficulty: "baja",
    instructions: [
      "Calienta caminando 3 minutos a ritmo suave.",
      "Camina a paso rápido manteniendo la espalda recta.",
      "Bombea los brazos de forma natural.",
      "Termina con 3 minutos de caminata lenta para enfriar.",
    ],
  },
  {
    name: "Sentadillas",
    description: "Ejercicio para fortalecer piernas y glúteos sin equipo.",
    duration: "3 series de 12",
    difficulty: "media",
    instructions: [
      "Párate con los pies al ancho de los hombros.",
      "Baja flexionando las rodillas como si fueras a sentarte.",
      "Mantén el pecho erguido y la espalda recta.",
      "Sube empujando con los talones y repite.",
    ],
  },
  {
    name: "Plancha",
    description: "Ejercicio isométrico para fortalecer el núcleo abdominal.",
    duration: "3 series de 30 segundos",
    difficulty: "alta",
    instructions: [
      "Apoya antebrazos y puntas de los pies en el suelo.",
      "Mantén el cuerpo en línea recta de cabeza a talones.",
      "Contrae el abdomen y respira de forma constante.",
      "Mantén la posición el tiempo indicado y descansa.",
    ],
  },
];

const TIPS = [
  {
    title: "Bebe agua antes de tener sed",
    content:
      "Mantén una botella de agua a la mano y bebe a lo largo del día. Evita las bebidas azucaradas y el exceso de refrescos durante el estudio.",
  },
  {
    title: "No saltes el desayuno",
    content:
      "Un desayuno balanceado con proteína y fibra mejora la concentración. Si tienes prisa, la avena o un batido son buenas opciones rápidas.",
  },
  {
    title: "Aumenta el consumo de frutas y verduras",
    content:
      "Incluye al menos 5 porciones al día. Son fuente de vitaminas, minerales y fibra que ayudan a mantener energía estable.",
  },
  {
    title: "Limita la comida rápida y los ultraprocesados",
    content:
      "No hay problema en darse un gusto de vez en cuando, pero trata de que no sea la regla. Planifica tus comidas de la semana.",
  },
];

async function seedContent(): Promise<void> {
  if ((await RecipeModel.estimatedDocumentCount()) === 0) {
    await RecipeModel.insertMany(RECIPES);
    console.log(`${RECIPES.length} recetas sembradas`);
  } else {
    console.log("Las recetas ya existen, no se sobrescriben");
  }

  if ((await ExerciseModel.estimatedDocumentCount()) === 0) {
    await ExerciseModel.insertMany(EXERCISES);
    console.log(`${EXERCISES.length} ejercicios sembrados`);
  } else {
    console.log("Los ejercicios ya existen, no se sobrescriben");
  }

  if ((await TipModel.estimatedDocumentCount()) === 0) {
    await TipModel.insertMany(TIPS);
    console.log(`${TIPS.length} consejos sembrados`);
  } else {
    console.log("Los consejos ya existen, no se sobrescriben");
  }
}

await mongoose.connect(config.mongoUri);
await seedAdmin();
await seedContent();
await mongoose.disconnect();
console.log("Seed completado");
