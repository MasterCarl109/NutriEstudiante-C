import { Schema, model, type Model, type InferSchemaType } from "mongoose";

const sessionSchema = new Schema(
  {
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type Session = InferSchemaType<typeof sessionSchema>;

export const SessionModel: Model<Session> = model<Session>(
  "Session",
  sessionSchema
);
