import React from "react";
import { Outlet, NavLink, Navigate } from "react-router-dom";
import {
  UserSVG,
  ProductSVG,
  OrderSVG,
  UsersSVG,
  LogoutSVG,
} from "../assets/svg/index";

const UserDropdownItems = [
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

function Dashboard() {
  const token = localStorage.getItem("access_token");
  return token ? (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[50px]">
      <div className="flex gap-[10px] min-h-dvh">
        <div className="w-[30%] bg-white border border-gray-200 shadow-xs px-4 pt-[40px] py-[10px] flex flex-col gap-[10px]">
          {UserDropdownItems.map((item, index) => (
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
          <div className="border-t border-gray-200 mt-2 pt-2">
            <button className="border border-gray-200 bg-gray-100 flex w-full items-center gap-2 px-4 py-2 mt-[50px] text-sm text-gray-700 hover:bg-[#0f1c3c] hover:text-white hover:text-[#0f1c3c] transition-colors rounded-md mx-1 rounded-md mx-1">
              <LogoutSVG />
              Logout
            </button>
          </div>
        </div>
        <div className="w-[70%] bg-white border border-gray-200 shadow-xs p-4">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/login" replace />
  );
}

export default Dashboard;
