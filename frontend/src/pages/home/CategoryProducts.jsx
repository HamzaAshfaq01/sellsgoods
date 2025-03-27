import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../axios";
import ProductFilter from "./ProductFilter";

const CategoryProducts = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ search: "", date: "", condition: [] });

  const observer = useRef(null);
  const lastProductRef = useCallback(
    (node) => {
      if (loading || !hasMore) return; 
      if (observer.current) observer.current.disconnect();
  
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });
  
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );
  

  // Reset filters and pagination when category changes
  useEffect(() => {
    setFilters({ search: "", date: "", condition: [] });
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, [category]);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!hasMore) return; // Stop fetching if no more products
  
      setLoading(true);
  
      try {
        const params = {
          search: filters.search || "",
          date: filters.date || "",
          condition: filters.condition.length > 0 ? filters.condition.join(",") : "",
          page,
          limit: 10, 
        };
  
        console.log("Fetching products for category:", category, "with params:", params);
  
        const response = await axios.get(`/products/getproductsbycategory/${category}`, { params });
  
        if (response.data.products.length === 0) {
          setHasMore(false);
        } else {
          
          setProducts((prev) => (page === 1 ? response.data.products : [...prev, ...response.data.products]));
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("No more products available.");
          setHasMore(false);
        } else {
          console.error("Error fetching category products:", error);
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchCategoryProducts();
  }, [category, filters, page]); 
  

  const handleFilterChange = (newFilters) => {
    console.log("New filters applied:", newFilters);
    setFilters(newFilters);
    setProducts([]);
    setPage(1);
    setHasMore(true);
  };

  return (
    <div className="relative xl:px-50 lg:px-10 px-5 max-w-[1200px] mx-auto">
  
      <div className="md:block absolute left-0 top-0 w-[250px] h-full z-10">
        <ProductFilter onFilterChange={handleFilterChange} />
      </div>

   
      <div className="md:pl-[300px]">
        <h2 className="text-2xl font-bold mb-6">{category}</h2>

        {products.length > 0 ? (
          <div className="space-y-6">
      {products.map((product, index) => {
  const uniqueKey = `${product.id || product._id}-${index}`;
  if (index === products.length - 1) {
    return (
      <div
        key={uniqueKey}
        ref={lastProductRef}
        onClick={() => navigate(`/productdetails/${product._id}/view`)}
        className="rounded-lg shadow-lg p-4 hover:shadow-xl transition cursor-pointer flex items-center gap-4"
      >
        <img
          src={`http://localhost:5000/${product.images?.[0]}`}
          alt={product.title}
          className="w-32 h-32 object-cover rounded-lg"
        />
        <div>
          <p className="text-lg font-bold text-[#0f1c3c]">PKR {product.price}</p>
          <h3 className="text-md font-semibold">{product.title}</h3>
          <p className="mt-2">{`${product.location?.area}, ${product.location?.city}`}</p>
          <p className="text-gray-600 text-sm">
            {new Date(product.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
          <p className="text-sm font-semibold mt-1">
            Condition: <span className="text-blue-600">{product.condition}</span>
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <div
        key={uniqueKey}
        onClick={() => navigate(`/productdetails/${product._id}/view`)}
        className="rounded-lg shadow-lg p-4 hover:shadow-xl transition cursor-pointer flex items-center gap-4"
      >
        <img
          src={`http://localhost:5000/${product.images?.[0]}`}
          alt={product.title}
          className="w-32 h-32 object-cover rounded-lg"
        />
        <div>
          <p className="text-lg font-bold text-[#0f1c3c]">PKR {product.price}</p>
          <h3 className="text-md font-semibold">{product.title}</h3>
          <p className="mt-2">{`${product.location?.area}, ${product.location?.city}`}</p>
          <p className="text-gray-600 text-sm">
            {new Date(product.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
          <p className="text-sm font-semibold mt-1">
            Condition: <span className="text-blue-600">{product.condition}</span>
          </p>
        </div>
      </div>
    );
  }
})}
          </div>
        ) : (
          <p className="text-gray-500">No products available in this category</p>
        )}

        {loading && (
          <div className="flex justify-center items-center mt-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0f1c3c]"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
