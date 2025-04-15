import React from 'react'

function FilterPageShimmers() {
    return (
        <div className="space-y-6 mt-6">
          {Array(6).fill(0).map((_, index) => (
            <div
              key={index}
              className="rounded-lg shadow-lg p-4 flex items-center gap-4 animate-pulse"
            >
              <div className="w-32 h-32 bg-gray-300 rounded-lg" />
              <div className="flex-1 space-y-3">
                <div className="w-24 h-4 bg-gray-300 rounded" />
                <div className="w-40 h-5 bg-gray-300 rounded" />
                <div className="w-32 h-4 bg-gray-300 rounded" />
                <div className="w-28 h-3 bg-gray-300 rounded" />
                <div className="w-36 h-4 bg-gray-300 rounded" />
              </div>
            </div>
          ))}
        </div>
      );
}

export default FilterPageShimmers