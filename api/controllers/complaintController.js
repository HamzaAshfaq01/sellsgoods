import asyncHandler from "../middleware/asyncHandler.js";
import Complaint from "../models/complaintModel.js";
import mongoose from "mongoose";
import  Order from "../models/orderModel.js";


const orderPopulate = {
  path: "order",
  select: "items subtotal tax shipping total status createdAt sellerId buyerId",
  populate: [
    {
      path: "items.productId",
      select: "title price image",
    },
    {
      path: "sellerId",
      select: "name email phone",
    },
    {
      path: "buyerId",
      select: "name email phone",
    },
  ],
};


const reportedByPopulate = {
  path: "reportedBy",
  select: "name email",
};


async function fetchFullComplaint(id) {
  return await Complaint.findById(id)
    .populate(orderPopulate)
    .populate(reportedByPopulate)
    .sort({ createdAt: -1 });
}

const getComplaints = asyncHandler(async (req, res) => {
  console.log("hello>>>>");
  const userId = req.user._id;
  const { page = 1, limit = 10 } = req.query;  

  console.log("User ID: ", req.user._id);

  const skip = (page - 1) * limit;  
  const limitNum = parseInt(limit, 10);  

  let complaints;
  let totalComplaints;
  
  
  if (req.user.role === "admin") {
    complaints = await Complaint.find()
      .populate(orderPopulate)
      .populate(reportedByPopulate)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    totalComplaints = await Complaint.countDocuments();  
  }
  
  
  else if (req.user.role === "buyer") {
    complaints = await Complaint.find({ reportedBy: userId })
      .populate(orderPopulate)
      .populate(reportedByPopulate)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    totalComplaints = await Complaint.countDocuments({ reportedBy: userId }); 
  }
  

  else if (req.user.role === "seller") {
    complaints = await Complaint.find({ sellerId: userId })
      .populate(orderPopulate)
      .populate(reportedByPopulate)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    totalComplaints = await Complaint.countDocuments({ sellerId: userId });  
  }

  
  if (complaints.length === 0) {
    return res.status(404).json({ message: "No complaints found." });
  }

  const totalPages = Math.ceil(totalComplaints / limitNum);  

  
  res.status(200).json({
    complaints,
    pagination: {
      currentPage: page,
      totalComplaints,
      totalPages,
      limit: limitNum,
    },
  });
});

  
  
  
  


  const createComplaint = asyncHandler(async (req, res) => {
    const { order, reason } = req.body;
  
    if (!order || !reason) {
      return res.status(400).json({ message: "Order and reason are required." });
    }
  

    const orderDetails = await Order.findById(order).populate('items.productId', 'title price image sellerId');
    console.log("Order Details:", orderDetails)
    
    if (!orderDetails) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (!orderDetails.buyerId || orderDetails.buyerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to file a complaint for this order." });
    }
  
    
    const sellerId = orderDetails.sellerId;
    console.log("Extracted Seller ID:", sellerId);
  
    const complaint = await Complaint.create({
      order,
      reason,
      reportedBy: req.user._id,
      sellerId
    });
  
    console.log("complaint>>>", complaint);
    res.status(201).json(complaint);
  });
  
  

const getComplaintById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid complaint ID" });
  }

  const complaint = await fetchFullComplaint(id);
  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  res.status(200).json(complaint);
});


const updateComplaint = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, sellerResponse } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid complaint ID" });
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  if (status) complaint.status = status;
  if (sellerResponse) complaint.sellerResponse = sellerResponse;
  await complaint.save();

  const fullComplaint = await fetchFullComplaint(id);
  res.status(200).json(fullComplaint);
});

const deleteComplaint = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid complaint ID" });
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) {
    return res.status(404).json({ message: "Complaint not found" });
  }

  await Complaint.deleteOne({ _id: id });
  res.status(200).json({ message: "Complaint deleted successfully" });
});

export {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
};
