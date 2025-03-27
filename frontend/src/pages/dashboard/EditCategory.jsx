import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../axios";

const EditCategoryScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const { data } = await axios.get(`/category/${id}`);
        setFormData({ name: data.name });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load category.");
      }
    };
    fetchCategory();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(`/category/${id}`, formData);
      if (response.status === 200) {
        toast.success("Category updated successfully!");
        navigate("/dashboard/categories");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred while updating category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Category</h1>

      <form onSubmit={submitHandler}>
        <div className="mb-8">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="name"
          >
            Category Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none border border-gray-200 transition-all focus:border-[#0f1c3c]"
            placeholder="Enter category title"
            required
          />
        </div>
        <div className="flex justify-end w-full">
          <button
            type="submit"
            className="bg-[#0f1c3c] text-white py-2 px-6 rounded-lg hover:bg-[#172a4d] transition-all"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Category"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCategoryScreen;
