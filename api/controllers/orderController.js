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
    console.log("Fetching orders for User ID:", userId);

   
    const orders = await Order.find({
      $or: [{ buyerId: userId }, { sellerId: userId }],
    })
      .populate("buyerId", "name email") 
      .populate("items.productId", "title price") 
      .sort({ createdAt: -1 });

    console.log("Orders Found:", orders);

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
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

export { createOrder, getOrders, getOrderById, updateOrder, deleteOrder };
