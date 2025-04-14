import mongoose from "mongoose";

const SalesSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true,
  },
  totalOrders: {
    type: Number,
    required: true,
  },
  totalRevenue: {
    type: Number,
    required: true,
  },
  averageOrderValue: {
    type: Number,
    required: true,
  },
  minOrderValue: {
    type: Number,
    required: true,
  },
  maxOrderValue: {
    type: Number,
    required: true,
  },
  bestSeller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  mostFrequentBuyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Sales = mongoose.model("Sales", SalesSchema);
export default Sales;
