import React from "react";

const HeroShimmers = () => {
  return (
    <div className="flex overflow-hidden space-x-2 py-2 px-8 w-full">
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="w-24 h-8 rounded-full bg-gray-200 animate-pulse"
          />
        ))}
    </div>
  );
};

export default HeroShimmers;
