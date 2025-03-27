import asyncHandler from "../middleware/asyncHandler.js";
import Category from "../models/categoryModel.js";
import mongoose from "mongoose";

const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Please provide a category name." });
    }

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});

const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});

const getCategoryById = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.name = req.body.name || category.name;
    await category.save();

    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

   
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

  
    await Category.deleteOne({ _id: id });

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete Category Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
const getListingCategories = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;  
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit;

 
    const categories = await Category.find({}, { name: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);


    const totalCount = await Category.countDocuments();

    res.status(200).json({
      categories,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalItems: totalCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});


export {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getListingCategories
};
