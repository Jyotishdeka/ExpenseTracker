import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema(
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
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "credit", "debit", "netbanking", "upi", "wallet"],
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    isShared: {
      type: Boolean,
      default: false,
    },
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    debt: {
      owedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      amount: Number,
      settled: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

transactionSchema.methods.isDebt = function () {
  return Boolean(this.debt.owedTo);
};

transactionSchema.methods.isSettled = function () {
  return this.debt.settled;
};

transactionSchema.methods.settleDebt = async function () {
  this.debt.settled = true;
  return await this.save();
};

transactionSchema.methods.shareTransaction = async function () {
  this.isShared = true;
  return await this.save();
};

export const Transaction = mongoose.model("Transaction", transactionSchema);
