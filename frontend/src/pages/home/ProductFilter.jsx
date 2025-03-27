import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "../../axios";

const ProductFilter = ({ onFilterChange }) => {
  const navigate = useNavigate();
  const { category: currentCategory } = useParams();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";
  const initialDate = queryParams.get("date") || "";
  const initialCondition = queryParams.get("condition") ? queryParams.get("condition").split(",") : [];
  const initialCategories = currentCategory
    ? [decodeURIComponent(currentCategory)]
    : queryParams.get("categories")
    ? queryParams.get("categories").split(",")
    : [];

  const [search, setSearch] = useState(initialSearch);
  const [date, setDate] = useState(initialDate);
  const [condition, setCondition] = useState(initialCondition);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(initialCategories);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State for small screen menu

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/category");
        setCategories(response.data);

        setSelectedCategories((prev) =>
          prev.filter((cat) => response.data.some((c) => c.name === cat))
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const handleConditionChange = (value) => {
    setCondition((prev) => (prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]));
  };

  const handleCategoryChange = (value) => {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (date) params.append("date", date);
    if (condition.length) params.append("condition", condition.join(","));
    if (selectedCategories.length) params.append("categories", selectedCategories.join(","));

    navigate(`/category/${selectedCategories.length ? selectedCategories.join(",") : "All"}?${params.toString()}`);

    onFilterChange({ search, date, condition, category: selectedCategories });

    setIsFilterOpen(false); // Close filter menu after applying filters
  };

  return (
    <>
      {/* Button to open filter menu on small screens */}
      <button
        className="md:hidden bg-[#0f1c3c] text-white py-2 px-4 rounded-lg fixed top-4 right-4 z-20"
        onClick={() => setIsFilterOpen(true)}
      >
        Open Filters
      </button>
      <div
  className={`fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-end md:justify-start transition-transform duration-300 ${
    isFilterOpen ? "translate-x-0" : "translate-x-full"
  } md:translate-x-0 md:relative md:bg-transparent`}
>
  <div className="bg-white shadow-md rounded-lg p-4 w-full md:w-64 h-full md:h-auto relative overflow-y-auto">
    {/* Close Button (Bigger & Inside Modal) */}
    <button
      className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700 md:hidden"
      onClick={() => setIsFilterOpen(false)}
    >
      ✕
    </button>

    <h3 className="text-lg font-bold mb-4 text-[#0f1c3c]">Filters</h3>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#0f1c3c] outline-none"
              placeholder="Enter product name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#0f1c3c] outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Condition</label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="new"
                checked={condition.includes("new")}
                onChange={() => handleConditionChange("new")}
                className="w-4 h-4 accent-[#0f1c3c] cursor-pointer"
              />
              <label htmlFor="new" className="text-sm text-gray-700 cursor-pointer">New</label>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="used"
                checked={condition.includes("used")}
                onChange={() => handleConditionChange("used")}
                className="w-4 h-4 accent-[#0f1c3c] cursor-pointer"
              />
              <label htmlFor="used" className="text-sm text-gray-700 cursor-pointer">Used</label>
            </div>
          </div>

          {/* Categories Dropdown */}
          <div className="mb-4 relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Categories</label>
            <div
              className="w-full border border-gray-300 rounded-lg p-2 bg-white cursor-pointer flex justify-between items-center"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="text-gray-700 text-sm">
                {selectedCategories.length > 0 ? selectedCategories.join(", ") : "Select Categories"}
              </span>
              <span className="text-gray-500">&#9662;</span>
            </div>

            {dropdownOpen && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10">
                <div className="p-2 max-h-40 overflow-y-auto">
                  {categories.map((category) => (
                    <div key={category._id} className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        id={category._id}
                        value={category.name}
                        checked={selectedCategories.includes(category.name)}
                        onChange={() => handleCategoryChange(category.name)}
                        className="w-4 h-4 accent-[#0f1c3c] cursor-pointer"
                      />
                      <label htmlFor={category._id} className="text-sm text-gray-700 cursor-pointer">
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={applyFilters}
            className="mt-4 w-full bg-[#0f1c3c] text-white py-2 rounded-lg hover:bg-[#0d172e] transition"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductFilter;
