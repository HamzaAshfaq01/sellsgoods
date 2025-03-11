import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../axios";
import DeleteConfirmationModal from "../../components/DeleteConfirmation";

const ProductListScreen = () => {
  const [loggedInUser, setLoggedInUser] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let response;
        const userData =
          localStorage.getItem("user") &&
          JSON.parse(localStorage.getItem("user"));
        setLoggedInUser(userData);
        if (userData?.role == "seller" && userData?.isAdmin == false) {
          response = await axios.get("/products/seller");
        } else {
          response = await axios.get("/products");
        }
        if (response.status == 200) {
          setProducts(response?.data);
        }
      } catch (error) {
        console.log("Error while fetching products", error);
      }
    };
    fetchProducts();
  }, []);

  const nextImage = (productId) => {
    setCurrentImageIndex((prev) => {
      const currentIndex = prev[productId] || 0;
      const product = products.find((p) => p._id === productId);
      const nextIndex = (currentIndex + 1) % product.images.length;
      return { ...prev, [productId]: nextIndex };
    });
  };

  const prevImage = (productId) => {
    setCurrentImageIndex((prev) => {
      const currentIndex = prev[productId] || 0;
      const product = products.find((p) => p._id === productId);
      const prevIndex =
        (currentIndex - 1 + product.images.length) % product.images.length;
      return { ...prev, [productId]: prevIndex };
    });
  };

  const getCurrentImageIndex = (productId) => {
    return currentImageIndex[productId] || 0;
  };

  const deleteHandler = (product) => {
    openDeleteModal(product);
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      const response = await axios.delete(`/products/${productToDelete._id}`);
      if (response.status === 200) {
        setProducts(products.filter((p) => p._id !== productToDelete._id));
        toast.success("Product deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to delete product. Please try again.",
        "error"
      );
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  };

  return (
    <React.Fragment>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <Link
          to="/dashboard/products/add"
          className="flex items-center gap-2 bg-[#0f1c3c] text-white py-2 px-4 rounded-lg hover:bg-[#162b5b] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Create Product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                PRODUCT
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                PRICE
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                LOCATION
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                CONDITION
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                CATEGORY
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product._id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-16 w-16 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden relative group">
                      <img
                        src={
                          import.meta.env.VITE_API_SERVER_UPLOADS +
                            product.images[getCurrentImageIndex(product._id)] ||
                          "/placeholder.svg"
                        }
                        alt={product.title}
                        className="h-16 w-16 object-cover"
                      />

                      {/* Image counter */}
                      {product?.images?.length > 1 && (
                        <div className="absolute bottom-0 right-0 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded-tl-md">
                          {getCurrentImageIndex(product?._id) + 1}/
                          {product?.images?.length}
                        </div>
                      )}

                      {/* Navigation arrows - only show on hover if multiple images */}
                      {product?.images?.length > 1 && (
                        <div className="absolute inset-0 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              prevImage(product?._id);
                            }}
                            className="bg-black bg-opacity-50 text-white p-1 rounded-full ml-1 hover:bg-opacity-70"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              nextImage(product?._id);
                            }}
                            className="bg-black bg-opacity-50 text-white p-1 rounded-full mr-1 hover:bg-opacity-70"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product?.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        Posted: {formatDate(product?.createdAt)}
                      </div>

                      {/* Thumbnail indicators */}
                      {product?.images?.length > 1 && (
                        <div className="flex mt-1 space-x-1">
                          {product?.images?.map((_, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImageIndex((prev) => ({
                                  ...prev,
                                  [product?._id]: index,
                                }));
                              }}
                              className={`w-1.5 h-1.5 rounded-full ${
                                index === getCurrentImageIndex(product?._id)
                                  ? "bg-[#0f1c3c]"
                                  : "bg-gray-300"
                              }`}
                              aria-label={`View image ${index + 1}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  PKR{" "}
                  {product?.price
                    ? product?.price.toFixed(2).replace(/\.00$/, "")
                    : "0.00"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product?.location?.area}, {product?.location?.city}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                      product?.condition === "new"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {product?.condition}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product?.category?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Link
                      to={`/dashboard/products/${product?._id}/view`}
                      className="text-[#0f1c3c] hover:text-[#162b5b] bg-gray-100 p-2 rounded-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                    {loggedInUser?._id === product?.seller?._id && (
                      <React.Fragment>
                        <Link
                          to={`/dashboard/products/${product?._id}/edit`}
                          className="text-[#0f1c3c] hover:text-[#162b5b] bg-gray-100 p-2 rounded-md"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => deleteHandler(product)}
                          className="text-white bg-red-500 hover:bg-red-600 p-2 rounded-md"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </React.Fragment>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {productToDelete && (
          <DeleteConfirmationModal
            isOpen={deleteModalOpen}
            onClose={closeDeleteModal}
            onConfirm={handleDeleteConfirm}
            itemName={productToDelete.title}
            isDeleting={isDeleting}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default ProductListScreen;
