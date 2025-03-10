import React from "react";
import { Outlet, NavLink, Navigate, useNavigate } from "react-router-dom";
import {
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

function Dashboard() {
  const userInfo =
    localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const MenuItems =
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
  return token ? (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[50px]">
      <div className="flex flex-col lg:flex-row gap-[10px] min-h-dvh">
        <div className="w-full lg:w-[30%] flex flex-row items-center lg:items-stretch lg:flex-col bg-white border border-gray-200 shadow-xs px-4 lg:pt-[40px] py-[10px] gap-[10px] overscroll-x-auto">
          {MenuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.href}
              className={({ isActive, isPending }) =>
                isPending
                  ? "bg-gray-300 text-gray-500"
                  : isActive
                  ? "bg-[#0f1c3c] flex items-center gap-2 px-4 py-2 text-sm text-white transition-colors rounded-md mx-1"
                  : "border border-gray-200 bg-gray-100 flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#0f1c3c] hover:text-white transition-colors rounded-md mx-1"
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
          <div className="lg:border-t lg:border-gray-200 lg:mt-2 lg:pt-2">
            <button
              onClick={handleLogout}
              className="border border-gray-200 bg-gray-100 flex w-full items-center gap-2 px-4 py-2 lg:mt-[50px] text-sm text-gray-700 hover:bg-[#0f1c3c] hover:text-white hover:text-[#0f1c3c] transition-colors rounded-md mx-1 rounded-md mx-1"
            >
              <LogoutSVG />
              Logout
            </button>
          </div>
        </div>
        <div className="w-full lg:w-[70%] bg-white border border-gray-200 shadow-xs p-4">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/login" replace />
  );
}

export default Dashboard;
