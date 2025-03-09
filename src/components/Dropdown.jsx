import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DownArrowSVG, UpArrowSVG } from "../assets/svg";

const Dropdown = ({ label, icon, items, actionButton }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <React.Fragment>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-2 text-gray-700 hover:text-[#0f1c3c] py-2 px-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        {icon}
        <span>{label}</span>
        <span
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <DownArrowSVG />
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-10 border border-gray-200">
          {items.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#0f1c3c] hover:text-white transition-colors rounded-md mx-1"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}

          {actionButton && (
            <div className="border-t border-gray-200 mt-2 pt-2">
              {actionButton}
            </div>
          )}
        </div>
      )}
    </React.Fragment>
  );
};

export default Dropdown;
