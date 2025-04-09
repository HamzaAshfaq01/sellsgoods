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


    console.log("hello>>>>")
    const userId = req.user._id;

    console.log("User ID: ", req.user._id);

  
    if (req.user.role === "admin") {
      const complaints = await Complaint.find()
        .populate(orderPopulate)
        .populate(reportedByPopulate)
        .sort({ createdAt: -1 });
      return res.status(200).json(complaints);
    }
  
    if (req.user.role === "buyer") {
      const complaints = await Complaint.find({ reportedBy: userId })
        .populate(orderPopulate)
        .populate(reportedByPopulate)
        .sort({ createdAt: -1 });
  
      if (complaints.length === 0) {
        return res.status(404).json({ message: "No complaints found for this buyer." });
      }
  
      return res.status(200).json(complaints);
    }
  
    if (req.user.role === "seller") {
        console.log("Seller entered");
        const userId = req.user._id;
        console.log("Seller User ID:", userId);
        
        const complaints = await Complaint.find({ sellerId: userId })
        //   .populate(orderPopulate)
        //   .populate(reportedByPopulate)
        //   .sort({ createdAt: -1 });
      
        console.log("Complaints for Seller:", complaints);
        
        if (complaints.length === 0) {
          return res.status(404).json({ message: "No complaints found for this seller." });
        }
      
        return res.status(200).json(complaints);
      }
      
    
  
    return res.status(403).json({ message: "Access denied." });
  });
  
  
  
  


  const createComplaint = asyncHandler(async (req, res) => {
    const { order, reason } = req.body;
  
    if (!order || !reason) {
      return res.status(400).json({ message: "Order and reason are required." });
    }
  
   
    const orderDetails = await Order.findById(order).populate('items.productId', 'title price image sellerId');
    if (!orderDetails) {
      return res.status(404).json({ message: "Order not found." });
    }
  
   
    if (orderDetails.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to file a complaint for this order." });
    }
  
    
    const sellerId = orderDetails.items[0].productId.sellerId;
  
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
