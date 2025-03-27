import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";
import axios from "../axios";
import Sidebar from "./Sidebar";
import {
  LogoSVG,
  HamburgerSVG,
  CrossSVG,
  CategorySVG,
  DownArrowSVG,
  UpArrowSVG,
  SearchSVG,
  CartSVG,
  UserSVG,
  ProductSVG,
  OrderSVG,
  UsersSVG,
  LogoutSVG,
} from "../assets/svg/index";
import { useCart } from "../context/CartContext";




const AdminDropdownItems = [
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: <UserSVG />,
  },
  {
    label: "Products",
    href: "/dashboard/products",
    icon: <ProductSVG />,
  },
  // {
  //   label: "Orders",
  //   href: "/dashboard/orderlist",
  //   icon: <OrderSVG />,
  // },
  // {
  //   label: "Users",
  //   href: "/dashboard/userlist",
  //   icon: <UsersSVG />,
  // },
];
const SellerDropdownItems = [
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: <UserSVG />,
  },
  {
    label: "Products",
    href: "/dashboard/products",
    icon: <ProductSVG />,
  },
  // {
  //   label: "Orders",
  //   href: "/dashboard/orderlist",
  //   icon: <OrderSVG />,
  // },
  // {
  //   label: "Users",
  //   href: "/dashboard/userlist",
  //   icon: <UsersSVG />,
  // },
];
const BuyerDropdownItems = [
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: <UserSVG />,
  },
  // {
  //   label: "Orders",
  //   href: "/dashboard/orderlist",
  //   icon: <OrderSVG />,
  // },
  // {
  //   label: "Users",
  //   href: "/dashboard/userlist",
  //   icon: <UsersSVG />,
  // },
];
const cartItems = [
  // { id: 1, qty: 2 },
  // { id: 2, qty: 1 },
];



export default function Header() {
  const userInfo =
    localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  const { cart } = useCart(); 
  const hasItems = cart?.length > 0;
  const totalItems = cart.reduce((total, item) => total + (item.quantity || 0), 0);
  const DropDownMenu =
    userInfo?.role == "admin"
      ? AdminDropdownItems
      : userInfo?.role == "seller"
      ? SellerDropdownItems
      : BuyerDropdownItems;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/category"); // Replace with actual API endpoint
        setCategories(data); // Assuming API returns an array of category names
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth >= 1024) {
      
        if (
          isMenuOpen &&
          !event.target.closest(".mobile-menu") &&
          !event.target.closest(".menu-toggle")
        ) {
          setIsMenuOpen(false);
        }
      }
    };
  
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen]);
  

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const LogoutButton = (
    <button
      onClick={handleLogout}
      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#0f1c3c] hover:text-white hover:text-[#0f1c3c] transition-colors rounded-md mx-1 rounded-md mx-1"
    >
      <LogoutSVG />
      Logout
    </button>
  );

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setIsDropdownOpen(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`/products/search?query=${searchQuery}`);

        setSearchResults(data); 
        setIsDropdownOpen(true);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    const debounce = setTimeout(fetchProducts, 300); 

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 border-b border-gray-200 ${
        scrolled ? "bg-white shadow-md" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link
            href="/"
            className="flex items-center gap-3 transition-transform hover:scale-105"
          >
            <div className="h-9 w-9 sm:h-10 sm:w-10 bg-[c] rounded-full overflow-hidden shadow-sm flex items-center justify-center">
              <LogoSVG />
            </div>
            <div className="flex flex-col">
            <Link to="/" className="text-xl sm:text-2xl font-bold tracking-tight text-[#0f1c3c] cursor-pointer">
    Sells&Goods
  </Link>
            </div>
          </Link>

          <button
            className="menu-toggle lg:hidden bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0f1c3c]/50"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <CrossSVG /> : <HamburgerSVG />}
          </button>

          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            <div className="relative">
              <Dropdown
                label="Categories"
                icon={<CategorySVG />}
                items={categories?.map((category) => ({
                  label: category.name, 
  href: `/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`,
                  adminOnly: false,
                  
                }))}
              />
            </div>

            <div className="relative w-64 xl:w-80">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <SearchSVG />
              </div>
              <input
        type="search"
        placeholder="Search products..."
        className="pl-10 w-full py-2 px-4 rounded-full bg-gray-100 text-gray-900 focus:ring-2 focus:ring-[#0f1c3c]/50 border border-gray-200"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Dropdown for search results */}
      {isDropdownOpen && searchResults.length > 0 && (
        <div className="absolute w-full mt-1 bg-white border border-gray-300 shadow-lg rounded-lg z-50">
          {searchResults.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate(`/productdetails/${product._id}/view`)}
            >
              <img
                  src={
                    import.meta.env.VITE_API_SERVER_UPLOADS +
                      product.images || "/placeholder.svg"
                  }
                  alt={product.title}
                  className="w-10 h-10 object-contain"
                />

              <span className="text-gray-800">{product.title}</span>
            </div>
          ))}
        </div>
      )}
  
  
            </div>

            <button
      onClick={() => navigate("/cart")}
      className={`flex items-center gap-2 py-2 px-4 rounded-full transition-colors cursor-pointer
        ${hasItems ? "bg-[#0f1c3c] text-white hover:bg-gray-800" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
    >
      <CartSVG />
      <span>Cart</span>
      {hasItems && (
        <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
          {totalItems}
        </span>
      )}
    </button>

            {userInfo ? (
              <div className="relative">
                <Dropdown
                  label={userInfo?.name}
                  icon={<UserSVG />}
                  items={DropDownMenu}
                  actionButton={LogoutButton}
                />
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 text-white py-2 px-4 rounded-full bg-[#0f1c3c] hover:bg-[#0f1c3c]/90 transition-colors"
              >
                <UserSVG />
                <span>Sign In</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
      <Sidebar isMenuOpen={isMenuOpen} closeMenu={() => setIsMenuOpen(false)} />
    </header>
  );
}
