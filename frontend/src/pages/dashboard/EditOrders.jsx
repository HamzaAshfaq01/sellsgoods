import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../axios";
import { toast } from "react-toastify";

const EditOrderScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [formData, setFormData] = useState({
    status: "",
    cancelReason: "",
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    // Fetch role from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.role) {
      setRole(storedUser.role);
    } else {
      toast.error("User role not found!");
      return;
    }

    // Fetch existing order details
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/orders/${id}`);
        setFormData({
          status: data.status || "Pending",
          cancelReason: data.cancelReason || "",
          name: data.name || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          address: data.address || "",
        });
      } catch (error) {
        toast.error("Failed to fetch order details.");
      } finally {
        setFetching(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/orders/${id}`, formData);
      toast.success("Order updated successfully!");
      navigate("/dashboard/orders");
    } catch (error) {
      toast.error("Failed to update order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Order</h1>

      {fetching ? (
        <p className="text-gray-600">Loading order details...</p>
      ) : (
        <form onSubmit={submitHandler}>
          {role === "seller" ? (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-900 focus:outline-none border border-gray-200 transition-all focus:border-[#0f1c3c]"
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-900 border border-gray-200 focus:outline-none transition-all focus:border-[#0f1c3c]"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-900 border border-gray-200 focus:outline-none transition-all focus:border-[#0f1c3c]"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-900 border border-gray-200 focus:outline-none transition-all focus:border-[#0f1c3c]"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-900 border border-gray-200 focus:outline-none transition-all focus:border-[#0f1c3c]"
                />
              </div>
            </>
          )}

          {formData.status === "Cancelled" && role === "seller" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cancellation Reason</label>
              <textarea
                name="cancelReason"
                value={formData.cancelReason}
                onChange={handleInputChange}
                className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-900 border border-gray-200 focus:outline-none transition-all focus:border-[#0f1c3c]"
                placeholder="Enter cancellation reason"
              />
            </div>
          )}

          <div className="flex justify-end w-full">
            <button
              type="submit"
              className="bg-[#0f1c3c] text-white py-2 px-6 rounded-lg hover:bg-[#172a4d] transition-all"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Order"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditOrderScreen;
