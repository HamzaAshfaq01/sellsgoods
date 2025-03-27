import { useEffect,useState, useRef } from "react";
import axios from "../../axios";

const Hero = () => {
  const [categories, setCategories] = useState([]);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/category");
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const scroll = (direction) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  const handleCategoryClick = (category) => {
    const normalizedCategory = category.trim().toLowerCase().replace(/\s+/g, "-");
    const newHash = `#category-${normalizedCategory}`;
  
    if (window.location.hash === newHash) {
      
      window.history.replaceState(null, null, " ");
      setTimeout(() => {
        window.location.hash = newHash;
      }, 10); 
    } else {
      window.location.hash = newHash;
    }
  };
  

  return (
    <div className="w-full py-6 px-10 2xl:px-50">
      <div className="w-full h-[200px] xl:px-50 px-10">
        <img
          src="/hero.png"
          alt="Hero"
          className="w-full h-full object-cover rounded-lg shadow-md"
        />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mt-25 mb-4">Shop by Category</h2>
      <div className="relative w-full mt-10">
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-md z-10"
          onClick={() => scroll("left")}
        >
          ◀
        </button>
        <div
          ref={sliderRef}
          className="flex overflow-hidden space-x-2 scrollbar-hide w-full py-2 px-8"
        >
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-white rounded-full shadow-md text-gray-700 text-sm font-medium whitespace-nowrap cursor-pointer hover:bg-gray-200"
                onClick={() => handleCategoryClick(category.name)}
              >
                {category.name}
              </span>
            ))
          ) : (
            <p className="text-gray-500">Loading categories...</p>
          )}
        </div>
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-md z-10"
          onClick={() => scroll("right")}
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default Hero;