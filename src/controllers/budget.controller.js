import { Budget } from "../models/budget.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const createBudget = asyncHandler(async (req, res) => {
  const { categoryId, limit, period, startDate, endDate } = req.body;
  const userId = req.user._id;

  if (!categoryId || !limit || !period || !startDate || !endDate) {
    res.status(400);
    throw new ApiError(400, "All fields are required");
  }

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(400, "Invalid category ID");
  }

  //iN FUTURE WE WILL ADD THIS
  // const categoryExists = await Category.findById(categoryId);
  // if (!categoryExists) {
  //   throw new ApiError(404, "Category not found");
  // }

  if (!["weekly", "monthly", "yearly"].includes(period)) {
    throw new ApiError(400, "Period must be weekly, monthly or yearly");
  }

  const today = new Date().setHours(0, 0, 0, 0); // Get today's date at midnight
  const start = new Date(startDate).setHours(0, 0, 0, 0);
  if (start < today) {
    throw new ApiError(400, "Start date cannot be earlier than today");
  }

  if (startDate > endDate) {
    throw new ApiError(400, "Start date must be before end date");
  }

  // check if budget already exists

  const existBudget = await Budget.findOne({ categoryId });
  if (existBudget) {
    throw new ApiError(409, "Budget already exists");
  }

  const budget = await Budget.create({
    userId,
    categoryId,
    limit,
    period,
    startDate,
    endDate,
  });
  const createdBudget = await Budget.findById(budget._id).populate(
    "categoryId"
  );
  if (!createdBudget) {
    res.status(500);
    throw new ApiError(500, "Something went wrong while creating the budget");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdBudget, "Budget Created"));
});

const getAllBudgets = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const budgets = await Budget.find({ userId }).populate("categoryId");

  if (!budgets) {
    res.status(500);
    throw new ApiError(500, "Somthing went wrong while fetching the budgets");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, budgets, "All budgets fetched"));
});

const getBudgetById = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const budgetId = req.params.id;
  const budget = await Budget.findOne({ _id: budgetId, userId }).populate(
    "categoryId"
  );

  if (!budget) {
    res.status(404);
    throw new ApiError(404, "Budget not found");
  }

  return res.status(200).json(new ApiResponse(200, budget, "Budget fetched"));
});

const updateBudget = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const budgetId = req.params.id;
  const { limit, period, startDate, endDate } = req.body;

  if (!limit || !period || !startDate || !endDate) {
    throw new ApiError(400, "All fields are required");
  }

  const budget = await Budget.findOne({ _id: budgetId, userId });

  if (!budget) {
    res.status(404);
    throw new ApiError(404, "Budget not found");
  }

  budget.limit = limit;
  budget.period = period;
  budget.startDate = startDate;
  budget.endDate = endDate;

  await budget.save();

  return res
    .status(200)
    .json(new ApiResponse(200, budget, "Budget updated successfully"));
});

const deleteBudgetById = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const budgetId = req.params.id;

  const budget = await Budget.findOneAndDelete({ _id: budgetId, userId });
  if (!budget) {
    res.status(404);
    throw new ApiError(404, "Budget not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Budget deleted successfully"));
});

const getBudgetsByCategory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const categoryId = req.params.id;

  const budgets = await Budget.find({ userId, categoryId }).populate(
    "categoryId"
  );

  if (!budgets) {
    res.status(500);
    throw new ApiError(500, "Something went wrong while fetching budgets");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, budgets, "Budgets fetched successfully"));
});

export {
  createBudget,
  getAllBudgets,
  getBudgetById,
  updateBudget,
  deleteBudgetById,
  getBudgetsByCategory,
};
