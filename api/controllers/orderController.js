import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import mongoose from "mongoose";

const createOrder = asyncHandler(async (req, res) => {
  try {
    const { customerName, email, phoneNumber, items, subtotal, tax, shipping, total, buyerId, sellerId } = req.body;

    
    if (!customerName || !email || !phoneNumber || !items || !subtotal || !tax || !shipping || !total || !buyerId || !sellerId) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }

    
    if (!mongoose.Types.ObjectId.isValid(buyerId) || !mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({ message: "Invalid buyerId or sellerId." });
    }

    const order = await Order.create({
      customerName,
      email,
      phoneNumber,
      items,
      subtotal,
      tax,
      shipping,
      total,
      buyerId: new mongoose.Types.ObjectId(buyerId),
      sellerId: new mongoose.Types.ObjectId(sellerId),
      status: "Pending",
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
});


const getOrders = asyncHandler(async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {
      $or: [{ buyerId: userId }, { sellerId: userId }],
    };

    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / limit);

    const orders = await Order.find(query)
      .populate("buyerId", "name email")
      .populate("items.productId", "title price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      orders,
      currentPage: page,
      totalPages,
      totalOrders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});



const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalOrders = await Order.countDocuments();
    const totalPages = Math.ceil(totalOrders / limit);

    const orders = await Order.find()
      .populate("buyerId", "name email")
      .populate("items.productId", "title price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      orders,
      currentPage: page,
      totalPages,
      totalOrders,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
});




const getOrderById = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.productId");
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order" });
  }
});


const updateOrder = asyncHandler(async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!updatedOrder) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order" });
  }
});


const deleteOrder = asyncHandler(async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order" });
  }
});

export { createOrder, getOrders, getOrderById, updateOrder, deleteOrder, getAllOrders };
