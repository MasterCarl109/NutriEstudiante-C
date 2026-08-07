import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/User.js";
import { RecipeModel } from "../models/Recipe.js";
import { ExerciseModel } from "../models/Exercise.js";
import { TipModel } from "../models/Tip.js";
import { config } from "../config/index.js";

const RESET =
  process.argv.includes("--reset") || process.env.SEED_RESET === "true";

async function seedAdmin(): Promise<void> {
  const exists = await UserModel.findOne({
    email: config.adminEmail.toLowerCase(),
  });

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
      "Desayuno rápido, económico y calórico: ideal si buscas subir de peso de forma saludable y empezar el día con energía.",
    category: "desayuno",
    suitableFor: ["underweight", "normal"],
    ingredients: [
      "1/2 taza de avena",
      "1 taza de leche o bebida vegetal",
      "1 plátano en rodajas",
      "1/2 taza de fresas",
      "1 cucharada de miel",
      "2 cucharadas de nueces",
      "Canela al gusto",
    ],
    instructions: [
      "Calienta la leche en una olla a fuego medio.",
      "Agrega la avena y cocina 5 minutos removiendo.",
      "Sirve en un tazón y añade el plátano, las fresas y las nueces.",
      "Cubre con miel y espolvorea canela.",
    ],
    nutrition: { calories: 420, protein: 13, carbs: 64, fat: 13 },
    image: "",
  },
  {
    title: "Yogur griego con frutos rojos",
    description:
      "Desayuno ligero y alto en proteína, perfecto si buscas controlar tu peso sin sacrificar saciedad.",
    category: "desayuno",
    suitableFor: ["overweight", "obesity"],
    ingredients: [
      "1 taza de yogur griego natural",
      "1/2 taza de frutos rojos",
      "1 cucharada de avena",
      "1 cucharadita de miel",
    ],
    instructions: [
      "Coloca el yogur en un tazón.",
      "Agrega los frutos rojos y la avena.",
      "Endulza con la miel y mezcla suavemente.",
    ],
    nutrition: { calories: 190, protein: 15, carbs: 20, fat: 5 },
    image: "",
  },
  {
    title: "Tostadas de aguacate con huevo",
    description:
      "Desayuno balanceado con grasas saludables y proteína. Aporta hierro y te mantiene satisfecho por horas.",
    category: "desayuno",
    suitableFor: ["underweight", "normal"],
    ingredients: [
      "2 rebanadas de pan integral",
      "1/2 aguacate",
      "2 huevos",
      "Sal y pimienta al gusto",
      "Tomate en rodajas",
    ],
    instructions: [
      "Tuesta el pan integral.",
      "Machaca el aguacate y úntalo sobre el pan.",
      "Cocina los huevos revueltos o estrellados.",
      "Coloca los huevos sobre el aguacate y acompaña con tomate.",
    ],
    nutrition: { calories: 330, protein: 15, carbs: 30, fat: 17 },
    image: "",
  },
  {
    title: "Ensalada de pollo con quinoa",
    description:
      "Almuerzo completo con proteína y carbohidratos complejos. Fácil de preparar y fácil de digerir.",
    category: "almuerzo",
    suitableFor: ["normal", "overweight"],
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
    title: "Lentejas con verduras y arroz integral",
    description:
      "Rico en hierro y fibra. Ideal para combatir el cansancio y mantener estables tus niveles de energía.",
    category: "almuerzo",
    suitableFor: ["underweight", "normal"],
    ingredients: [
      "1 taza de lentejas cocidas",
      "1/2 taza de arroz integral",
      "1 zanahoria en cubos",
      "1/2 cebolla picada",
      "1 tomate en cubos",
      "1 pimiento",
      "Comino y laurel al gusto",
    ],
    instructions: [
      "Sofríe la cebolla, el pimiento y el tomate.",
      "Agrega la zanahoria y las lentejas con un poco de agua.",
      "Condimenta con comino y laurel y cocina 15 minutos.",
      "Sirve con el arroz integral.",
    ],
    nutrition: { calories: 450, protein: 22, carbs: 66, fat: 8 },
    image: "",
  },
  {
    title: "Salmón al horno con vegetales",
    description:
      "Plato rico en omega-3 y proteína. Excelente para ganar masa magra y cuidar la salud del corazón.",
    category: "almuerzo",
    suitableFor: ["underweight"],
    ingredients: [
      "1 filete de salmón (150 g)",
      "1 calabacín en rodajas",
      "1 zanahoria en bastones",
      "Espárragos",
      "Aceite de oliva, limón, sal y pimienta",
    ],
    instructions: [
      "Precalienta el horno a 200 °C.",
      "Coloca el salmón y los vegetales en una bandeja.",
      "Rocía con aceite de oliva y limón, y sazona.",
      "Hornea 15-18 minutos hasta que el salmón esté cocido.",
    ],
    nutrition: { calories: 480, protein: 38, carbs: 18, fat: 28 },
    image: "",
  },
  {
    title: "Pechuga a la plancha con brócoli",
    description:
      "Almuerzo bajo en calorías y alto en proteína, perfecto si estás en déficit para reducir peso.",
    category: "almuerzo",
    suitableFor: ["overweight", "obesity"],
    ingredients: [
      "1 pechuga de pollo (150 g)",
      "1 taza de brócoli",
      "Ajo y cebolla en polvo",
      "Aceite de oliva en spray",
    ],
    instructions: [
      "Sazona la pechuga con ajo y cebolla en polvo.",
      "Cocina la pechuga en una plancha caliente con poco aceite.",
      "Cocina el brócoli al vapor 5 minutos.",
      "Sirve la pechuga acompañada del brócoli.",
    ],
    nutrition: { calories: 290, protein: 38, carbs: 14, fat: 8 },
    image: "",
  },
  {
    title: "Sopa de verduras con pollo",
    description:
      "Cena reconfortante y ligera que llena sin aportar demasiadas calorías. Ayuda a no cenar de más.",
    category: "cena",
    suitableFor: ["overweight", "obesity"],
    ingredients: [
      "1 pechuga de pollo en trozos",
      "1 zanahoria",
      "1 calabacín",
      "1/2 cebolla",
      "1 papa pequeña",
      "Apio y perejil",
    ],
    instructions: [
      "Pica todas las verduras en cubos.",
      "Hierve agua con la cebolla, el apio y el pollo.",
      "Agrega las verduras y cocina 20 minutos.",
      "Sazona con perejil y sal al gusto.",
    ],
    nutrition: { calories: 210, protein: 24, carbs: 18, fat: 4 },
    image: "",
  },
  {
    title: "Tortilla de claras con espinaca",
    description:
      "Cena alta en proteína, baja en calorías y rica en hierro. Ideal para cuidar el peso sin perder músculo.",
    category: "cena",
    suitableFor: ["overweight", "normal"],
    ingredients: [
      "4 claras de huevo",
      "1 puñado de espinaca fresca",
      "1/2 tomate en cubos",
      "Aceite de oliva",
      "Sal y pimienta",
    ],
    instructions: [
      "Sofríe la espinaca y el tomate con un poco de aceite.",
      "Bate las claras y viértelas sobre las verduras.",
      "Cocina a fuego medio hasta que cuaje por ambos lados.",
    ],
    nutrition: { calories: 200, protein: 24, carbs: 10, fat: 7 },
    image: "",
  },
  {
    title: "Quinoa con garbanzos y tomate",
    description:
      "Cena vegetariana rica en hierro vegetal y fibra, fácil de preparar y muy nutritiva.",
    category: "cena",
    suitableFor: ["normal", "underweight"],
    ingredients: [
      "1 taza de quinoa cocida",
      "1/2 taza de garbanzos cocidos",
      "1 tomate en cubos",
      "1/2 pepino",
      "Jugo de limón y aceite de oliva",
      "Perejil picado",
    ],
    instructions: [
      "Mezcla la quinoa con los garbanzos, el tomate y el pepino.",
      "Aliña con limón, aceite de oliva, perejil y sal.",
      "Deja reposar 5 minutos y sirve.",
    ],
    nutrition: { calories: 380, protein: 16, carbs: 56, fat: 10 },
    image: "",
  },
  {
    title: "Frutos secos con yogur",
    description:
      "Snack calórico y nutritivo para subir de peso de forma sana entre comidas.",
    category: "snack",
    suitableFor: ["underweight"],
    ingredients: [
      "1 taza de yogur natural",
      "30 g de nueces o almendras",
      "1 cucharada de avena",
      "1 cucharadita de miel",
    ],
    instructions: [
      "Sirve el yogur en un tazón.",
      "Agrega los frutos secos y la avena.",
      "Endulza con la miel y mezcla.",
    ],
    nutrition: { calories: 350, protein: 12, carbs: 26, fat: 22 },
    image: "",
  },
  {
    title: "Palitos de vegetales con hummus",
    description:
      "Snack ligero, crujiente y saciante. Perfecto para calmar el antojo entre comidas sin descuidar el peso.",
    category: "snack",
    suitableFor: ["overweight", "obesity"],
    ingredients: [
      "1 zanahoria en bastones",
      "1/2 pepino en bastones",
      "1/2 taza de hummus",
      "Palitos de apio",
    ],
    instructions: [
      "Lava y corta los vegetales en bastones.",
      "Sirve con el hummus como dip.",
    ],
    nutrition: { calories: 180, protein: 6, carbs: 22, fat: 8 },
    image: "",
  },
  {
    title: "Batido de plátano, avena y maní",
    description:
      "Bebida calórica y energética, ideal para después de estudiar o entrenar si necesitas ganar peso.",
    category: "batido",
    suitableFor: ["underweight"],
    ingredients: [
      "1 plátano maduro",
      "1 taza de leche o bebida vegetal",
      "2 cucharadas de avena",
      "1 cucharada de mantequilla de maní",
      "1 cucharadita de miel",
    ],
    instructions: [
      "Coloca todos los ingredientes en la licuadora.",
      "Licúa hasta obtener una mezcla homogénea.",
      "Sirve inmediatamente.",
    ],
    nutrition: { calories: 420, protein: 14, carbs: 62, fat: 14 },
    image: "",
  },
  {
    title: "Batido verde de espinaca y manzana",
    description:
      "Bebida refrescante rica en hierro y vitaminas, ligera y perfecta para mantenerse activo.",
    category: "batido",
    suitableFor: ["normal", "overweight"],
    ingredients: [
      "1 manzana verde",
      "1 puñado de espinaca",
      "1/2 pepino",
      "Jugo de medio limón",
      "1 vaso de agua",
    ],
    instructions: [
      "Lava todos los ingredientes.",
      "Colócalos en la licuadora con el agua y el limón.",
      "Licúa y sirve con hielo.",
    ],
    nutrition: { calories: 160, protein: 4, carbs: 32, fat: 2 },
    image: "",
  },
  {
    title: "Gelatina de frutas",
    description:
      "Postre muy ligero que satisface el antojo de dulce con muy pocas calorías. Ideal en planes de reducción de peso.",
    category: "postre",
    suitableFor: ["overweight", "obesity"],
    ingredients: [
      "1 sobre de gelatina sin azúcar",
      "1/2 taza de frutas picadas (fresas, kiwi, durazno)",
      "Agua",
    ],
    instructions: [
      "Prepara la gelatina según las indicaciones del empaque.",
      "Agrega las frutas picadas.",
      "Refrigera hasta que cuaje y sirve.",
    ],
    nutrition: { calories: 90, protein: 2, carbs: 20, fat: 0 },
    image: "",
  },
];

const EXERCISES = [
  {
    name: "Caminata rápida",
    description:
      "Cardio de bajo impacto ideal para quemar grasa, mejorar el estado físico y reducir el estrés. Buen punto de partida si llevas tiempo sin actividad.",
    duration: "30 minutos",
    difficulty: "baja",
    goal: "cardio",
    instructions: [
      "Calienta caminando 3 minutos a ritmo suave.",
      "Camina a paso rápido manteniendo la espalda recta.",
      "Bombea los brazos de forma natural.",
      "Termina con 3 minutos de caminata lenta para enfriar.",
    ],
  },
  {
    name: "Trote suave",
    description:
      "Eleva la frecuencia cardíaca para mejorar la resistencia cardiovascular y acelerar la quema de calorías.",
    duration: "20 minutos",
    difficulty: "media",
    goal: "cardio",
    instructions: [
      "Camina 5 minutos para calentar.",
      "Alterna 2 minutos de trote y 1 de caminata.",
      "Repite el ciclo 6 veces.",
      "Enfría caminando 3 minutos.",
    ],
  },
  {
    name: "Saltos de tijera",
    description:
      "Ejercicio cardiovascular intenso que activa todo el cuerpo, mejora la coordinación y quema calorías en poco tiempo.",
    duration: "3 series de 30 segundos",
    difficulty: "media",
    goal: "cardio",
    instructions: [
      "Párate con los pies juntos y los brazos al costado.",
      "Salta abriendo piernas y brazos a la vez.",
      "Regresa a la posición inicial y repite sin pausa.",
      "Descansa 30 segundos entre series.",
    ],
  },
  {
    name: "Bicicleta estática",
    description:
      "Cardio de bajo impacto que fortalece piernas y corazón sin lastimar las articulaciones.",
    duration: "25 minutos",
    difficulty: "baja",
    goal: "cardio",
    instructions: [
      "Ajusta el asiento a la altura de la cadera.",
      "Pedalea a ritmo moderado 5 minutos para calentar.",
      "Mantén un ritmo constante 20 minutos.",
      "Finaliza pedaleando suave 2 minutos.",
    ],
  },
  {
    name: "Sentadillas",
    description:
      "Fortalece piernas y glúteos, mejora la postura y facilita las actividades diarias. No requiere equipo.",
    duration: "3 series de 12",
    difficulty: "media",
    goal: "fuerza",
    instructions: [
      "Párate con los pies al ancho de los hombros.",
      "Baja flexionando las rodillas como si fueras a sentarte.",
      "Mantén el pecho erguido y la espalda recta.",
      "Sube empujando con los talones y repite.",
    ],
  },
  {
    name: "Plancha",
    description:
      "Fortalece el núcleo abdominal y protege la espalda. Clave para mejorar la postura y el equilibrio.",
    duration: "3 series de 30 segundos",
    difficulty: "alta",
    goal: "fuerza",
    instructions: [
      "Apoya antebrazos y puntas de los pies en el suelo.",
      "Mantén el cuerpo en línea recta de cabeza a talones.",
      "Contrae el abdomen y respira de forma constante.",
      "Mantén la posición el tiempo indicado y descansa.",
    ],
  },
  {
    name: "Flexiones",
    description:
      "Desarrolla fuerza en pecho, brazos y hombros. Puedes hacerlas apoyando las rodillas si eres principiante.",
    duration: "3 series de 8",
    difficulty: "media",
    goal: "fuerza",
    instructions: [
      "Apoya manos y puntas de los pies en el suelo.",
      "Mantén el cuerpo alineado y baja el pecho al piso.",
      "Empuja para volver a la posición inicial.",
      "Descansa 45 segundos entre series.",
    ],
  },
  {
    name: "Zancadas",
    description:
      "Trabaja piernas y glúteos mejorando el equilibrio y la estabilidad en cada paso.",
    duration: "3 series de 10 por pierna",
    difficulty: "media",
    goal: "fuerza",
    instructions: [
      "Da un paso largo hacia adelante.",
      "Baja hasta que ambas rodillas formen ángulos de 90 grados.",
      "Empuja con la pierna delantera para volver.",
      "Alterna piernas y repite.",
    ],
  },
  {
    name: "Estiramientos matutinos",
    description:
      "Mejora la flexibilidad, reduce la rigidez matutina y prepara el cuerpo para el día.",
    duration: "10 minutos",
    difficulty: "baja",
    goal: "movilidad",
    instructions: [
      "Estira brazos hacia arriba y hacia los lados.",
      "Inclínate suavemente hacia el frente tocando el suelo.",
      "Realiza rotaciones de cuello y hombros.",
      "Sostén cada estiramiento 20 segundos sin rebotar.",
    ],
  },
  {
    name: "Movilidad de cadera",
    description:
      "Reduce la tensión de pasar muchas horas sentado y mejora la postura.",
    duration: "8 minutos",
    difficulty: "baja",
    goal: "movilidad",
    instructions: [
      "De pie, haz círculos amplios con la cadera.",
      "Da pasos laterales con rodillas suaves.",
      "Realiza estocadas lentas sin carga.",
      "Termina con una postura de sentadilla profunda breve.",
    ],
  },
  {
    name: "Subir escaleras",
    description:
      "Mejora la resistencia cardiovascular y fortalece piernas sin necesidad de equipo.",
    duration: "3 series de 2 pisos",
    difficulty: "media",
    goal: "resistencia",
    instructions: [
      "Calienta subiendo un piso a ritmo suave.",
      "Sube 2 pisos a un ritmo constante.",
      "Baja caminando para recuperar.",
      "Repite 3 veces con descansos de 1 minuto.",
    ],
  },
  {
    name: "Equilibrio en un pie",
    description:
      "Desarrolla el equilibrio y fortalece tobillos y core, ayudando a prevenir caídas.",
    duration: "3 series de 30 segundos por pierna",
    difficulty: "baja",
    goal: "equilibrio",
    instructions: [
      "Párate derecho con los brazos al costado.",
      "Levanta un pie y mantén el equilibrio.",
      "Apóyate en una pared si lo necesitas.",
      "Cambia de pierna y repite.",
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
  {
    title: "Incluye fuentes de hierro",
    content:
      "Las lentejas, los garbanzos, la espinaca y el huevo ayudan a prevenir el cansancio. Acompáñalos con alimentos ricos en vitamina C para absorber mejor el hierro.",
  },
  {
    title: "No le tengas miedo a la proteína",
    content:
      "La proteína ayuda a mantener el músculo y a sentirte satisfecho. Inclúyela en el desayuno, el almuerzo y la cena.",
  },
  {
    title: "Duerme al menos 7 horas",
    content:
      "Dormir bien regula el apetito y mejora el rendimiento académico. Evita pantallas una hora antes de acostarte.",
  },
  {
    title: "Sirve porciones adecuadas",
    content:
      "Usa platos medianos y sirve primero la ensalada o verdura. Sirve la comida en la cocina y evita repetir directamente de la olla.",
  },
];

async function seedContent(): Promise<void> {
  if (RESET) {
    await RecipeModel.deleteMany({});
    await ExerciseModel.deleteMany({});
    await TipModel.deleteMany({});
    console.log("Colecciones de contenido limpiadas (--reset)");
  }

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
