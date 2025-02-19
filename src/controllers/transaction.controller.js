import { Transaction } from "../models/transaction.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createTransaction = asyncHandler(async (req, res) => {
  const {
    categoryId,
    type,
    amount,
    description,
    paymentMethod,
    tag,
    isShared,
    sharedWith,
    debt,
  } = req.body;
  const userId = req.user._id;

  if (
    !categoryId ||
    !type ||
    !amount ||
    !description ||
    !paymentMethod ||
    !tag
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (["income", "expense"].includes(type) === false) {
    throw new ApiError(400, "Invalid transaction type");
  }

  if (
    !["cash", "credit", "debit", "netbanking", "upi", "wallet"].includes(
      paymentMethod
    )
  ) {
    throw new ApiError(400, "Invalid payment method");
  }

  const transaction = await Transaction.create({
    userId,
    categoryId,
    type,
    amount,
    description,
    paymentMethod,
    tag,
    isShared: isShared || false,
    sharedWith: sharedWith || [],
    debt: debt || { owedTo: null, amount: 0, settled: false },
  });

  const createdTransaction = await Transaction.findById(
    transaction._id
  ).populate("categoryId");

  if (!createdTransaction) {
    throw new ApiError(
      500,
      "Something went wrong while creating the transaction"
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdTransaction, "Transaction Created"));
});

export { createTransaction };
