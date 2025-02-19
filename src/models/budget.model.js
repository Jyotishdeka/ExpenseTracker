import mongoose, { Schema } from "mongoose";

const budgetSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    limit: {
      type: Number,
      required: true,
    },
    period: {
      type: String,
      enum: ["weekly", "monthly", "yearly"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    spent: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

budgetSchema.methods.isExceeded = function () {
  return this.spent > this.limit;
};

budgetSchema.methods.getRemainingBudget = function () {
  return this.limit - this.spent;
};

export const Budget = mongoose.model("Budget", budgetSchema);
