import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../axios";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const [loggedInUser, setLoggedInUser] = useState({});
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();


  useEffect(() => {
    const userData =
      localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"));
    setLoggedInUser(userData);
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/products/${id}`);
        if (response.status === 200) {
          setProduct(response.data);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const nextImage = () => {
    if (product?.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images?.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + product.images.length) % product.images.length
      );
    }
  };

  const selectImage = (index) => {
    setCurrentImageIndex(index);
  };
  const { updateCart } = useCart();
 
  
  const addToCart = () => {
    const cartItem = {
      id: product._id,
      title: product.title,
      price: product.price,
      image: product.images?.[0] || null,
      sellerId: product.seller?._id,
      quantity: 1,
      addedAt: new Date().toISOString(),
    };
  
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = existingCart.findIndex(item => item.id === product._id);
  
    if (existingItemIndex !== -1) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push(cartItem);
    }
  
    localStorage.setItem("cart", JSON.stringify(existingCart));
  
    toast.success("Item added to cart! 🛒");
    updateCart(existingCart);
  
    navigate("/cart");
  };
  

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0f1c3c]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-red-500 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <p className="text-lg font-medium text-gray-800">{error}</p>
        <Link
          to="/dashboard/products"
          className="mt-4 text-[#0f1c3c] hover:underline"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-lg font-medium text-gray-800">Product not found</p>
        <Link
          to="/dashboard/products"
          className="mt-4 text-[#0f1c3c] hover:underline"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between flex-col-reverse gap-[10px] items-start mb-6 md:flex-row md:items-cente">
        <h1 className="text-2xl font-bold text-gray-800 truncate max-w-2xl">
          {product.title}
        </h1>
        <div className="flex space-x-3">
          <Link
            to="/"
            className="flex items-center gap-2 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </Link>
          {/* {loggedInUser?._id === product?.seller?._id && (
            <Link
              to={`/dashboard/products/${id}/edit`}
              className="flex items-center gap-2 bg-[#0f1c3c] text-white py-2 px-4 rounded-lg hover:bg-[#162b5b] transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Product
            </Link>
          )} */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative aspect-video bg-gray-100">
              {product.images && product.images.length > 0 ? (
                <img
                  src={
                    import.meta.env.VITE_API_SERVER_UPLOADS +
                      product.images[currentImageIndex] || "/placeholder.svg"
                  }
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              {product.images && product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                    aria-label="Previous image"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
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
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                    aria-label="Next image"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
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
                </>
              )}

              {product.images && product.images.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-sm px-2 py-1 rounded-md">
                  {currentImageIndex + 1} / {product.images.length}
                </div>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="p-4 overflow-x-auto">
                <div className="flex space-x-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => selectImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                        currentImageIndex === index
                          ? "border-[#0f1c3c]"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={
                          import.meta.env.VITE_API_SERVER_UPLOADS + image ||
                          "/placeholder.svg"
                        }
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-[#0f1c3c]"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Description
            </h2>
            <div className="prose max-w-none text-gray-600">
              {product.description.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  PKR {product.price.toLocaleString()}
                </h2>
                {product.negotiable && (
                  <span className="text-green-600 text-sm font-medium">
                    Negotiable
                  </span>
                )}
              </div>
              <span
                className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full capitalize ${
                  product.condition === "new"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {product.condition}
              </span>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Posted: {formatDate(product.createdAt)}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-[#0f1c3c]"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
              Details
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-gray-500 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <span className="block text-sm font-medium text-gray-700">
                    Category
                  </span>
                  <span className="text-gray-600">
                    {product.category?.name || "Uncategorized"}
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-gray-500 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <span className="block text-sm font-medium text-gray-700">
                    Location
                  </span>
                  <span className="text-gray-600">
                    {product.location.area}, {product.location.city}
                  </span>
                </div>
              </li>
              {product.tags && product.tags.length > 0 && (
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-500 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <span className="block text-sm font-medium text-gray-700">
                      Tags
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {product.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              )}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 mr-2 text-[#0f1c3c]"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
        clipRule="evenodd"
      />
    </svg>
    Seller Information
  </h2>
  <ul className="space-y-3">
    <li className="flex items-start">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2 text-gray-500 mt-0.5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
          clipRule="evenodd"
        />
      </svg>
      <div>
        <span className="block text-sm font-medium text-gray-700">Name</span>
        <span className="text-gray-600">{product.seller.name}</span>
      </div>
    </li>
    <li className="flex items-start">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2 text-gray-500 mt-0.5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
      </svg>
      <div>
        <span className="block text-sm font-medium text-gray-700">Phone</span>
        <span className="text-gray-600">{product.contact.phone}</span>
      </div>
    </li>
    <li className="flex items-start">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2 text-gray-500 mt-0.5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
      </svg>
      <div>
        <span className="block text-sm font-medium text-gray-700">Email</span>
        <span className="text-gray-600">{product.seller.email}</span>
      </div>
    </li>
  </ul>


  <div className="mt-4 flex space-x-4">
    <a
      href={`tel:${product.contact.phone}`}
      className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm text-center  font-medium hover:bg-blue-600 transition w-full"
    >
      Call Now
    </a>
    <a
  href={`mailto:${product.contact?.email || ""}`}
  className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm text-center font-medium hover:bg-green-600 transition w-full"
>
  Via Email
</a>
<a
 onClick={addToCart}
 
  className="bg-black text-white px-4 py-2 rounded-lg text-sm text-center font-medium hover:bg-black transition w-full"
>
  Order here
</a>
  </div>
</div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
