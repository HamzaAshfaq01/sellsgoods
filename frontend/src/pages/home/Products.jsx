import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axios";

const ProductCard = () => {
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [imageIndexes, setImageIndexes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/products/getproducts");
        setCategories(response.data.categories || []);
        setProductsByCategory(response.data.productsByCategory || {});
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const checkHashAndScroll = () => {
      const hash = window.location.hash.replace("#category-", "");
      if (hash && !loading && categories.length > 0) {
        const targetId = `category-${hash}`;
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          setTimeout(() => {
            const headerHeight = 100;
            const elementTop = targetElement.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
              top: elementTop - headerHeight,
              behavior: "smooth"
            });
          }, 300);
        }
      }
    };

    checkHashAndScroll();
    window.addEventListener("hashchange", checkHashAndScroll);
    return () => window.removeEventListener("hashchange", checkHashAndScroll);
  }, [loading, categories]);

  const getCurrentImageIndex = (productId) => imageIndexes[productId] || 0;

  const prevImage = (productId) => {
    setImageIndexes((prev) => ({
      ...prev,
      [productId]: prev[productId] > 0 ? prev[productId] - 1 : 0,
    }));
  };

  const nextImage = (productId, imagesLength) => {
    setImageIndexes((prev) => ({
      ...prev,
      [productId]: prev[productId] < imagesLength - 1 ? prev[productId] + 1 : imagesLength - 1,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0f1c3c]"></div>
      </div>
    );
  }

  return (
    <div className="2xl:px-50 xl:px-10 px-5">
      {categories.map((category) => {
        const normalizedCategory = category
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-");
  
        return (
          <div
            id={`category-${normalizedCategory}`}
            key={normalizedCategory}
            className="mb-8"
          >
            <h2 className="text-xl font-bold mb-4">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productsByCategory[category]?.slice(0, 4).map((product) => (
                <div
                  key={product.id || product._id}
                  onClick={() => navigate(`/productdetails/${product._id}/view`)}
                  className="relative rounded-lg shadow-lg p-4 block hover:shadow-xl transition cursor-pointer group"
                >
                  <img
                    src={`http://localhost:5000/${product.images?.[getCurrentImageIndex(product._id)]}`}
                    alt={product.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  
                  {product?.images?.length > 1 && (
                    <>
                      <div className="absolute bottom-0 right-0 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded-tl-md">
                        {getCurrentImageIndex(product._id) + 1}/{product?.images?.length}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            prevImage(product._id);
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
                            nextImage(product._id, product.images.length);
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
                    </>
                  )}
  
                  <p className="text-lg font-bold text-[#0f1c3c] mt-3">PKR {product.price}</p>
                  <h3 className="text-md font-semibold">{product.title}</h3>
                  <p className="mt-2">{`${product.location?.area}, ${product.location?.city}`}</p>
                  <p className="text-gray-600 text-sm">
                    {new Date(product.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
            {productsByCategory[category]?.length > 4 && (
              <button
                onClick={() => navigate(`/category/${category}?categories=${encodeURIComponent(category)}`)}
                className="mt-4 px-4 py-2 bg-[#0f1c3c] text-white font-semibold rounded-lg hover:bg-[#122850] transition cursor-pointer"
              >
                See More
              </button>
            )}
          </div>
        );
      })}
      {categories.length === 0 && !loading && (
        <p className="text-center text-gray-500">No categories available</p>
      )}
    </div>
  );
};

export default ProductCard;