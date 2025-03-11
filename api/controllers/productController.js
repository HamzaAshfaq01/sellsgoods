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

    if (
      !title ||
      !description ||
      !category ||
      !price ||
      !location ||
      !contact
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category." });
    }

    const seller = await User.findById(req.user._id);
    if (!seller) {
      return res.status(400).json({ message: "Invalid seller." });
    }

    console.log(req.files, "req.files");
    const images = req.files.map((file) => file.path.replace(/\\/g, "/"));
    const newProduct = new Product({
      title,
      description,
      condition,
      category,
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
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .populate("seller", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(products);
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
    const products = await Product.find({ seller: req.user._id })
      .populate("category", "name")
      .populate("seller", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(products);
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

export {
  createProduct,
  getAllProducts,
  getProductById,
  getSellerProducts,
  updateProduct,
  deleteProduct,
};
