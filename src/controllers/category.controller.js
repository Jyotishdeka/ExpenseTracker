import { Category } from "../models/category.Model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createCategory = asyncHandler(async (req, res) => {
  const { name, type, icon } = req.body;
  const userId = req.user._id;

  if (!name || !type) {
    throw new ApiError(400, "Name and type are required filed");
  }

  if (!["income", "expense"].includes(type)) {
    throw new ApiError(400, "Enter a valid Category");
  }

  const existingCategory = await Category.findOne({ name, type, userId });

  if (existingCategory) {
    throw new ApiError(409, "Category already exist");
  }

  const category = await Category.create({
    name: name.toLowerCase(),
    type,
    userId,
    icon,
  });

  const createdCategory = await Category.findById(category._id);
  if (!createdCategory) {
    throw new ApiError(500, "Somthing went wrong while creating the category");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdCategory, "Category Created"));
});

const getAllCategories = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const categories = await Category.find({ userId });
  return res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories fetched"));
});

const getCategoryById = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const categoryId = req.params.id;
  const category = await Category.findOne({ _id: categoryId, userId });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category fetched"));
});

const updateCategory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const categoryId = req.params.id;
  const { name, type, icon } = req.body;

  if (!name || !type) {
    throw new ApiError(400, "Name and type are required fields");
  }

  const category = await Category.findOne({ _id: categoryId, userId });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  category.name = name.toLowerCase();
  category.type = type;
  category.icon = icon;

  await category.save();

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category updated"));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const categoryId = req.params.id;

  const category = await Category.findOneAndDelete({ _id: categoryId, userId });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return res.status(200).json(new ApiResponse(200, {}, "Category deleted"));
});

export {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
