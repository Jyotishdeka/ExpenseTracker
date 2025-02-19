import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    icon: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Category = mongoose.model("Category", categorySchema);
