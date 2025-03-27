import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import User from "../models/userModel.js";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

const createProduct = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      description,
      condition,
      category,
      tags,
      price,
      negotiable,
      location,
      contact,
    } = req.body;

    if (!title || !description || !category || !price || !location || !contact) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    let categoryId = category;

  
    if (!mongoose.Types.ObjectId.isValid(category)) {
      const categoryDoc = await Category.findOne({ name: category });
      if (!categoryDoc) {
        return res.status(400).json({ message: "Invalid category name." });
      }
      categoryId = categoryDoc._id; 
    } else {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: "Invalid category ID." });
      }
    }


    const seller = await User.findById(req.user._id);
    if (!seller) {
      return res.status(400).json({ message: "Invalid seller." });
    }

 
    const images = req.files?.map((file) => file.path.replace(/\\/g, "/")) || [];


    const newProduct = new Product({
      title,
      description,
      condition,
      category: categoryId,
      tags,
      price,
      negotiable,
      location,
      contact,
      images,
      seller: req.user._id,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});


const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments(); // Total number of products
    const products = await Product.find()
      .populate("category", "name")
      .populate("seller", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});

const getProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("seller", "name email");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});

const getSellerProducts = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments({ seller: req.user._id }); // Total number of products for the seller
    const products = await Product.find({ seller: req.user._id })
      .populate("category", "name")
      .populate("seller", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      description,
      condition,
      category,
      tags,
      price,
      negotiable,
      location,
      contact,
      imagesToDelete,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only edit your own products" });
    }

    if (Array.isArray(JSON.parse(imagesToDelete))) {
      const uploadsDir = path.resolve("uploads");
      JSON.parse(imagesToDelete).forEach((imagePath) => {
        if (imagePath.startsWith("uploads/")) {
          imagePath = imagePath.slice("uploads/".length);
        }
        const fullImagePath = path.join(uploadsDir, imagePath);
        fs.unlinkSync(fullImagePath);
        product.images = product.images.filter(
          (image) => image !== `uploads/${imagePath}`
        );
      });
    }

    let images = [...product.images];
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.path.replace(/\\/g, "/"));
      images = [...images, ...newImages];
    }

    product.title = title || product.title;
    product.description = description || product.description;
    product.condition = condition || product.condition;
    product.category = category || product.category;
    product.tags = tags || product.tags;
    product.price = price || product.price;
    product.negotiable =
      negotiable !== undefined ? negotiable : product.negotiable;
    product.location = location || product.location;
    product.contact = contact || product.contact;
    product.images = images;

    await product.save();

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only delete your own products" });
    }

    const uploadsDir = path.resolve("uploads");
    product.images.forEach((imagePath) => {
      if (imagePath.startsWith("uploads/")) {
        imagePath = imagePath.slice("uploads/".length);
      }
      const fullImagePath = path.join(uploadsDir, imagePath);
      if (fs.existsSync(fullImagePath)) {
        fs.unlinkSync(fullImagePath);
      }
    });

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});
const getProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .populate("seller", "name email")
      .sort({ createdAt: -1 });

    const categories = [...new Set(products.map((product) => product.category.name))];

  
    const productsByCategory = {};
    products.forEach((product) => {
      const categoryName = product.category.name;
      if (!productsByCategory[categoryName]) {
        productsByCategory[categoryName] = [];
      }
      productsByCategory[categoryName].push(product);
    });

    res.status(200).json({ categories, productsByCategory });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});
const getProductsByCategory = asyncHandler(async (req, res) => {
  try {
    const { category } = req.params;
    const { search, date, condition, page = 1, limit = 10 } = req.query;

    console.log("Received category param:", category);
    console.log("Received filters:", { search, date, condition, page, limit });

    let filter = {}; 
    let categoryNames = []; 

    if (category && category !== "All") {
      categoryNames = category.split(","); 

      const categoryObjs = await Category.find({ name: { $in: categoryNames } });

      if (categoryObjs.length === 0) {
        return res.status(404).json({ message: `No matching categories found` });
      }

      filter.category = { $in: categoryObjs.map((cat) => cat._id) };
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" }; 
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      filter.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    if (condition) {
      const conditionArray = condition.split(",");
      filter.condition = { $in: conditionArray };
    }

    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch total count for pagination
    const totalProducts = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate("category", "name")
      .populate("seller", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    res.status(200).json({
      category: category === "All" ? "All Categories" : categoryNames.join(", "),
      products,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalProducts / limitNumber),
      totalProducts,
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

const searchProducts = asyncHandler(async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const searchRegex = new RegExp(query, "i"); // Case-insensitive search

    const products = await Product.find({
      $or: [
        { title: searchRegex }, // Match product title
        { name: searchRegex }, // Match product name
        { description: searchRegex }, // Match description
      ],
    })
      .populate("category", "name")
      .populate("seller", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});


export {
  createProduct,
  getAllProducts,
  getProductById,
  getSellerProducts,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductsByCategory,
  searchProducts

};
