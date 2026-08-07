import { Schema, model, type Model, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      maxlength: [80, "El nombre no puede superar 80 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El correo es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Correo inválido"],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
    },
    age: {
      type: Number,
      min: [1, "Edad inválida"],
      max: [120, "Edad inválida"],
    },
    weight: {
      type: Number,
      min: [1, "Peso inválido"],
      max: [500, "Peso inválido"],
    },
    height: {
      type: Number,
      min: [0.5, "Estatura inválida"],
      max: [2.5, "Estatura inválida"],
    },
    sex: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "Sexo inválido",
      },
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "Rol inválido",
      },
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform: (_doc, ret: Record<string, unknown>) => {
    const { password, __v, ...safe } = ret;
    return safe;
  },
});

export type User = InferSchemaType<typeof userSchema>;

export const UserModel: Model<User> = model<User>("User", userSchema);
