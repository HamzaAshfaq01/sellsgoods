import { Link, useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";
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

const categories = [
  "Electronics",
  "Clothing",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Books",
  "Sports & Outdoors",
  "Toys & Games",
  "Health & Wellness",
];

const cartItems = [
  // { id: 1, qty: 2 },
  // { id: 2, qty: 1 },
];

const userInfo = { name: "John Doe", isAdmin: true };

export default function Sidebar({ isMenuOpen, closeMenu }) {
  const userInfo =
    localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const DropDownMenu =
    userInfo?.role == "admin"
      ? AdminDropdownItems
      : userInfo?.role == "seller"
      ? SellerDropdownItems
      : BuyerDropdownItems;

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

  return (
    <aside
      className={`fixed top-0 bottom-0 lg:hidden left-[-360px] w-[360px] bg-white shadow-xl z-50 transition-all duration-300 border-b border-gray-200 ${
        isMenuOpen ? "bg-white shadow-md left-[0]" : "bg-white"
      }`}
    >
      <div className="flex items-center justify-between border-b border-gray-200 p-[20px]">
        <Link
          href="/"
          className="flex items-center gap-3 transition-transform hover:scale-105"
        >
          <div className="h-9 w-9 sm:h-10 sm:w-10 bg-[#0f1c3c] rounded-full overflow-hidden shadow-sm flex items-center justify-center">
            <LogoSVG />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#0f1c3c]">
              Sells&Goods
            </span>
          </div>
        </Link>
        <button
          className="menu-toggle lg:hidden bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0f1c3c]/50"
          onClick={(e) => {
            e.stopPropagation();
            closeMenu(!isMenuOpen);
          }}
          aria-label="Toggle menu"
        >
          <CrossSVG />
        </button>
      </div>

      <nav className="mt-[40px] p-[20px] flex flex-col items-center gap-[30px] xl:gap-6">
        <div className="w-full flex flex-col items-center gap-[10px]">
          <div className="relative w-full">
            <Dropdown
              label="Categories"
              icon={<CategorySVG />}
              items={categories?.map((category) => ({
                label: category,
                href: `/category/${category
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`,
                adminOnly: false,
              }))}
            />
          </div>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchSVG />
            </div>
            <input
              type="search"
              placeholder="Search products by name or category..."
              className="pl-10 w-full py-2 px-4 rounded-full bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0f1c3c]/50 focus:bg-white border border-gray-200 transition-all"
            />
          </div>
        </div>
        <div className="w-full flex gap-[10px]">
          <Link
            href="/cart"
            className="flex items-center gap-2 text-gray-700 hover:text-[#0f1c3c] py-2 px-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <CartSVG />
            <span>Cart</span>
            {cartItems.length > 0 && (
              <span className="bg-[#0f1c3c] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
          </Link>

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
        </div>
      </nav>
    </aside>
  );
}
