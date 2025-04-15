import React from 'react';

const ProductShimmers = () => {
  return (
    <div className="2xl:px-50 xl:px-10 px-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array(12).fill(0).map((_, index) => (
          <div
            key={index}
            className="rounded-lg shadow-lg p-4 animate-pulse w-full"
          >
            <div className="w-full h-48 bg-gray-300 rounded-t-lg" />
            <div className="mt-3 space-y-2">
              <div className="w-1/2 h-4 bg-gray-300 rounded" />
              <div className="w-3/4 h-5 bg-gray-300 rounded" />
              <div className="w-2/3 h-4 bg-gray-300 rounded" />
              <div className="w-1/3 h-3 bg-gray-300 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductShimmers;
