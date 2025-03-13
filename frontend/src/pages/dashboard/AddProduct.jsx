import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../axios";

const AddProductScreen = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    condition: "used",
    category: "",
    tags: [],
    price: 0,
    negotiable: false,
    location: {
      area: "",
      city: "",
    },
    contact: {
      name: "",
      email: "",
      phone: "",
    },
    images: [],
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/category");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [name]: value },
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [name]: value },
    }));
  };

  const handleConditionChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, condition: value }));
  };
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      }
      setTagInput("");
    }
  };
  
  const handleRemoveTag = (index) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData?.images?.length > 12) {
      alert("You can upload a maximum of 12 photos.");
      return;
    }
    const filePreviews = files.map((file) => URL.createObjectURL(file));
    if (files?.length == 1) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, files[0]] }));
    } else {
      setFormData((prev) => ({ ...prev, images: [...prev.images, files] }));
    }
    setImagePreviews((prevPreviews) => [...prevPreviews, ...filePreviews]);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formData.images];
    const updatedPreviews = [...imagePreviews];

    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setFormData((prev) => ({ ...prev, images: updatedImages }));
    setImagePreviews(updatedPreviews);
  };

  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formDataToSend = new FormData();
    try {
      for (const [key, value] of Object.entries(formData)) {
        if (key === "location" || key === "contact") {
          for (const [subKey, subValue] of Object.entries(value)) {
            formDataToSend.append(`${key}[${subKey}]`, subValue);
          }
        } else if (key === "tags") {
          value.forEach((tag) => formDataToSend.append("tags[]", tag));
        } else if (key !== "images") {
          formDataToSend.append(key, value);
        }
      }
      formData.images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      const response = await axios.post("/products", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status == 201) {
        toast.success("Product added successfully!");
        setFormData({});
        navigate("/dashboard/products");
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(
          error.response.data.message ||
            "An error occurred while adding product."
        );
      } else if (error.request) {
        toast.error("No response from server. Please try again.");
      } else {
        toast.error("Error occurred while making the request.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Post Your Ad</h1>

      <form onSubmit={submitHandler}>
        <div className="mb-8">
          <div className="space-y-6">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="title"
              >
                Ad title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none border border-gray-200 transition-all focus:border-[#0f1c3c]"
                placeholder="Enter title"
                maxLength={70}
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none border border-gray-200 transition-all focus:border-[#0f1c3c]"
                placeholder="Include condition, features, reason for selling"
                required
              />
            </div>
            <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Tags <span className="text-red-500">*</span>
      </label>
      <div className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-900 border border-gray-200 focus-within:border-[#0f1c3c] transition-all">
        <div className="flex flex-wrap gap-2">
        
          {formData.tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center bg-[#0f1c3c] text-white text-sm px-3 py-1 rounded-full"
            >
              {tag}
              <button
                type="button"
                className="ml-2 text-white hover:text-gray-300"
                onClick={() => handleRemoveTag(index)}
              >
                ✕
              </button>
            </div>
          ))}
         
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500"
            placeholder="Enter tags and press Enter"
          />
        </div>
      </div>
    </div>

            <div>
              <span className="block text-sm font-medium text-gray-700 mb-2">
                Condition <span className="text-red-500">*</span>
              </span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="condition"
                    value="new"
                    onChange={handleConditionChange}
                    checked={formData.condition === "new"}
                    className="w-4 h-4 text-[#0f1c3c] focus:ring-[#0f1c3c]"
                  />
                  <span className="text-gray-700">New</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="condition"
                    value="used"
                    onChange={handleConditionChange}
                    checked={formData.condition === "used"}
                    className="w-4 h-4 text-[#0f1c3c] focus:ring-[#0f1c3c]"
                  />
                  <span className="text-gray-700">Used</span>
                </label>
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="brand"
              >
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-900 focus:outline-none border border-gray-200 transition-all focus:border-[#0f1c3c]"
                required
              >
                <option value="">Select Category</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id} className="capitalize">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Set a price
          </h2>

          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="price"
              >
                Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full py-2 pl-8 pr-4 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none border border-gray-200 transition-all focus:border-[#0f1c3c]"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>
            <div className="mb-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="negotiable"
                  checked={formData.negotiable}
                  onChange={(e) =>
                    setFormData({ ...formData, negotiable: e.target.checked })
                  }
                  className="w-4 h-4 text-[#0f1c3c] focus:ring-[#0f1c3c] rounded"
                />
                <span className="text-gray-700">Negotiable</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Upload Photos
          </h2>

          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Add up to 12 photos. First photo will be the cover (drag to
              reorder)
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div
                onClick={handleBoxClick}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-32 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                  className="absolute top-0 left-0"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span className="text-xs text-gray-500 text-center">
                  Add Photo
                </span>
              </div>

              {imagePreviews.map((image, index) => (
                <div
                  key={index}
                  className="relative border border-gray-200 rounded-lg p-1 h-32 bg-gray-50 flex items-center justify-center"
                >
                  <img
                    src={image}
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    type="button"
                    className="cursor-pointer absolute top-0 right-0 bg-[#0f1c3c] text-white p-1 rounded-full text-xs w-[30px] h-[30px]"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Your Location
          </h2>

          <div className="space-y-6">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="area"
              >
                Area <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="area"
                name="area"
                value={formData.location.area}
                onChange={handleLocationChange}
                className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none border border-gray-200 transition-all focus:border-[#0f1c3c]"
                placeholder="Area"
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="city"
              >
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.location.city}
                onChange={handleLocationChange}
                className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none border border-gray-200 transition-all focus:border-[#0f1c3c]"
                placeholder="City"
                required
              />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Contact Details
          </h2>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="contact-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="contact-name"
                name="name"
                value={formData.contact.name}
                onChange={handleContactChange}
                className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none border border-gray-200 transition-all focus:border-[#0f1c3c]"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="contact-email"
                name="email"
                value={formData.contact.email}
                onChange={handleContactChange}
                className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none border border-gray-200 transition-all focus:border-[#0f1c3c]"
                placeholder="Your email address"
                required
              />
            </div>

            <div>
              <label
                htmlFor="contact-phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="contact-phone"
                name="phone"
                value={formData.contact.phone}
                onChange={handleContactChange}
                className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none border border-gray-200 transition-all focus:border-[#0f1c3c]"
                placeholder="Your phone number"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-[#0f1c3c] text-white rounded-lg hover:bg-[#162b5b] transition-colors"
          >
            {loading ? "Loading...." : "Post Ad"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductScreen;
