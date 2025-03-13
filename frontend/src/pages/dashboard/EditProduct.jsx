import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";

const EditProductScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get product ID from URL
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(true);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [tagInput, setTagInput] = useState("");
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
    newImages: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchingProduct(true);
        const categoriesResponse = await axios.get("/category");
        setCategories(categoriesResponse.data);

        const productResponse = await axios.get(`/products/${id}`);
        const product = productResponse.data;

        setExistingImages(product.images || []);

        setFormData({
          title: product.title || "",
          description: product.description || "",
          condition: product.condition || "used",
          category: product.category?._id || "",
          tags: product.tags || [],
          price: product.price || 0,
          negotiable: product.negotiable || false,
          location: {
            area: product.location?.area || "",
            city: product.location?.city || "",
          },
          contact: {
            name: product.contact?.name || "",
            email: product.contact?.email || "",
            phone: product.contact?.phone || "",
          },
          newImages: [],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setFetchingProduct(false);
      }
    };

    fetchData();
  }, [id]);

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
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput(""); // Clear input field
    }
  };
  
  // Function to handle removing a tag
  const handleRemoveTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };
  
  // Function to handle Enter key for adding tags
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const totalImages =
      existingImages.length + formData.newImages.length + files.length;

    if (totalImages > 12) {
      toast.warning("You can have a maximum of 12 photos in total.");
      return;
    }

    const filePreviews = files.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      newImages: [...prev.newImages, ...files],
    }));
    setNewImagePreviews((prevPreviews) => [...prevPreviews, ...filePreviews]);
  };

  const handleRemoveNewImage = (index) => {
    const updatedImages = [...formData.newImages];
    const updatedPreviews = [...newImagePreviews];

    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setFormData((prev) => ({ ...prev, newImages: updatedImages }));
    setNewImagePreviews(updatedPreviews);
  };

  const handleRemoveExistingImage = (image, index) => {
    const updatedImages = [...existingImages];
    updatedImages.splice(index, 1);
    setExistingImages(updatedImages);
    setImagesToDelete((prevSelected) => [...prevSelected, image]);
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
        } else if (key !== "newImages") {
          formDataToSend.append(key, value);
        }
      }

      formDataToSend.append("imagesToDelete", JSON.stringify(imagesToDelete));
      formData.newImages.forEach((image) => {
        formDataToSend.append("images", image);
      });

      const response = await axios.put(`/products/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Product updated successfully!");
        navigate("/dashboard/products");
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        toast.error(
          error.response.data.message ||
            "An error occurred while updating product."
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

  if (fetchingProduct) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0f1c3c]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Product</h1>

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
  <label
    className="block text-sm font-medium text-gray-700 mb-1"
    htmlFor="tags"
  >
    Tags <span className="text-red-500">*</span>
  </label>
  <div className="relative">
    <div className="flex flex-wrap gap-2 border border-gray-200 rounded-lg bg-gray-100 py-2 px-4 focus-within:border-[#0f1c3c] transition-all">
      {formData.tags.map((tag, index) => (
        <span
          key={index}
          className="flex items-center bg-[#0f1c3c] text-white text-sm px-3 py-1 rounded-full"
        >
          {tag}
          <button
            type="button"
            onClick={() => handleRemoveTag(index)}
            className="ml-2 text-xs text-white bg-gray-700 rounded-full w-4 h-4 flex items-center justify-center"
          >
            X
          </button>
        </span>
      ))}
      <input
        type="text"
        id="tags"
        name="tags"
        value={tagInput}
        onChange={handleTagInputChange}
        onKeyDown={handleTagKeyDown}
        placeholder="Add tags (press Enter or comma)"
        className="bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none w-full"
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
                htmlFor="category"
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
            Product Photos
          </h2>

          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              You can have up to 12 photos in total.{" "}
              {existingImages.length + formData.newImages.length}/12 used.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {existingImages.map((image, index) => (
                <div
                  key={`existing-${index}`}
                  className="relative border border-gray-200 rounded-lg p-1 h-32 bg-gray-50 flex items-center justify-center"
                >
                  <img
                    src={import.meta.env.VITE_API_SERVER_UPLOADS + image}
                    alt={`product-${index}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleRemoveExistingImage(image, index)}
                    type="button"
                    className="cursor-pointer absolute top-0 right-0 bg-[#0f1c3c] text-white p-1 rounded-full text-xs w-[30px] h-[30px]"
                  >
                    X
                  </button>
                </div>
              ))}

              {newImagePreviews.map((image, index) => (
                <div
                  key={`new-${index}`}
                  className="relative border border-gray-200 rounded-lg p-1 h-32 bg-gray-50 flex items-center justify-center"
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`new-preview-${index}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleRemoveNewImage(index)}
                    type="button"
                    className="cursor-pointer absolute top-0 right-0 bg-[#0f1c3c] text-white p-1 rounded-full text-xs w-[30px] h-[30px]"
                  >
                    X
                  </button>
                </div>
              ))}

              {existingImages.length + formData.newImages.length < 12 && (
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
                    className="hidden"
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
              )}
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
            onClick={() => navigate("/dashboard/products")}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#0f1c3c] text-white rounded-lg hover:bg-[#162b5b] transition-colors flex items-center justify-center"
          >
            {loading ? "Updating...." : "Update Ad"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductScreen;
