import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../axios";
import { toast } from "react-toastify";
import { Progress } from "antd";

const EditComplaintScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    status: "",
    reason: "",
    productTitle: "",
    reportedBy: "",
    reportedAt: "",
    sellerEmail: "",  
    sellerResponse: "", 
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  
  const statusSteps = {
    "Pending": 0,
    "In Progress": 50,
    "Resolved": 100,
    "Rejected": 100,
  };

  const statusColor = {
    "Pending": "#fadb14",
    "In Progress": "#1890ff",
    "Resolved": "#52c41a",
    "Rejected": "#f5222d",
  };
  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const { data } = await axios.get(`/complaints/${id}`);
        
        
        console.log("Fetched complaint data:", data);
  
        
        if (data && data.order) {
          setFormData({
            status: data.status || "Pending",
            reason: data.reason || "",
            
            productTitle: data.order.items && Array.isArray(data.order.items) && data.order.items.length > 0 
              ? data.order.items[0]?.title 
              : "No product info available", 
            reportedBy: data.reportedBy?.email || "",
            reportedAt: data.createdAt || "",
            sellerEmail: data.order.sellerId?.email || "", 
            sellerResponse: data.sellerResponse || "", 
          });
        } else {
          toast.error("Order details are missing.");
        }
      } catch (error) {
        console.error("Error fetching complaint:", error);  
        toast.error("Failed to fetch complaint details.");
      } finally {
        setFetching(false);
      }
    };
  
    fetchComplaint();
  }, [id]);
  
  
  
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/complaints/${id}`, { status: formData.status });
      toast.success("Complaint updated successfully!");
      navigate("/dashboard/complaints");
    } catch (error) {
      toast.error("Failed to update complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Complaint</h1>

      {fetching ? (
        <p className="text-gray-600">Loading complaint details...</p>
      ) : (
        <form onSubmit={submitHandler}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
            <input
              type="text"
              name="productTitle"
              value={formData.productTitle}
              disabled
              className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-900 border border-gray-200 focus:outline-none transition-all"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Reported By</label>
            <input
              type="text"
              name="reportedBy"
              value={formData.reportedBy}
              disabled
              className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-900 border border-gray-200 focus:outline-none transition-all"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Reported At</label>
            <input
              type="text"
              name="reportedAt"
              value={formData.reportedAt}
              disabled
              className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-900 border border-gray-200 focus:outline-none transition-all"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <textarea
              name="reason"
              value={formData.reason}
              disabled
              className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-900 border border-gray-200 focus:outline-none transition-all"
            />
          </div>

          {/* New Seller Email Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Seller Email</label>
            <input
              type="text"
              name="sellerEmail"
              value={formData.sellerEmail}
              disabled
              className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-900 border border-gray-200 focus:outline-none transition-all"
            />
          </div>

          {/* New Seller Response Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Seller Response</label>
            <textarea
              name="sellerResponse"
              value={formData.sellerResponse}
              disabled
              className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-900 border border-gray-200 focus:outline-none transition-all"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Complaint Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-900 focus:outline-none border border-gray-200 transition-all focus:border-[#0f1c3c]"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Complaint Progress</label>
            <Progress
              percent={statusSteps[formData.status]}
              strokeColor={statusColor[formData.status]}
              showInfo={true}
            />
          </div>

          <div className="flex justify-end w-full">
            <button
              type="submit"
              className="bg-[#0f1c3c] text-white py-2 px-6 rounded-lg hover:bg-[#172a4d] transition-all"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Complaint"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditComplaintScreen;
