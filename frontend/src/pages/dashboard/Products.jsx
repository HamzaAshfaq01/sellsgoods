"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";

const products = [
  {
    _id: "1",
    name: "iPhone 13 Pro - Perfect Condition",
    price: 699.99,
    location: "New York, NY",
    postedDate: "2023-09-15",
    condition: "Used",
    category: "Electronics",
    images: [
      "https://regen.pk/cdn/shop/files/REGEN-iPhone13Pro-Frontback-Silver-Pakistan.png?v=1682421163&width=990",
      "https://regen.pk/cdn/shop/files/REGEN-iPhone13Pro-Frontback-Graphite-Pakistan.png?v=1691222769&width=990",
    ],
  },
  {
    _id: "2",
    name: "Sony PlayStation 5 with 2 Controllers",
    price: 499.99,
    location: "Los Angeles, CA",
    postedDate: "2023-09-18",
    condition: "New",
    category: "Gaming",
    images: [
      "https://media.direct.playstation.com/is/image/psdglobal/PS5-DISC-SLIM-TWO-DUALSENSE-Hero-1?$Background_Large$",
      "https://media.direct.playstation.com/is/image/psdglobal/ps5-astro-hero-1-box-uk?$Background_Large$",
    ],
  },
  {
    _id: "3",
    name: "Leather Sofa - 3 Seater",
    price: 350.0,
    location: "Chicago, IL",
    postedDate: "2023-09-10",
    condition: "Used",
    category: "Furniture",
    images: [
      "https://images.olx.com.pk/thumbnails/523670925-800x600.webp",
      "https://images.olx.com.pk/thumbnails/523670926-800x600.webp",
    ],
  },
  {
    _id: "4",
    name: "Mountain Bike - Trek X-Caliber 8",
    price: 650.0,
    location: "Denver, CO",
    postedDate: "2023-09-20",
    condition: "Used",
    category: "Sports",
    images: [
      "https://media.trekbikes.com/image/upload/f_auto,fl_progressive:semi,q_auto,w_1920,h_1440,c_pad/XCaliber8_22_35069_A_Portrait",
      "https://media.trekbikes.com/image/upload/f_auto,fl_progressive:semi,q_auto,w_1920,h_1440,c_pad/XCaliber8_22_35069_A_Primary",
    ],
  },
  {
    _id: "5",
    name: 'MacBook Pro 16" M1 Pro',
    price: 1899.99,
    location: "Austin, TX",
    postedDate: "2023-09-22",
    condition: "New",
    category: "Electronics",
    images: [
      "https://images.olx.com.pk/thumbnails/524182952-800x600.webp",
      "https://images.olx.com.pk/thumbnails/524182953-800x600.webp",
      "https://images.olx.com.pk/thumbnails/524182954-800x600.webp",
    ],
  },
];

const ProductListScreen = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  const nextImage = (productId) => {
    setCurrentImageIndex((prev) => {
      const currentIndex = prev[productId] || 0;
      const product = products.find((p) => p._id === productId);
      const nextIndex = (currentIndex + 1) % product.images.length;
      return { ...prev, [productId]: nextIndex };
    });
  };

  const prevImage = (productId) => {
    setCurrentImageIndex((prev) => {
      const currentIndex = prev[productId] || 0;
      const product = products.find((p) => p._id === productId);
      const prevIndex =
        (currentIndex - 1 + product.images.length) % product.images.length;
      return { ...prev, [productId]: prevIndex };
    });
  };

  const getCurrentImageIndex = (productId) => {
    return currentImageIndex[productId] || 0;
  };

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      console.log(`Deleting product with ID: ${id}`);
    }
  };

  return (
    <React.Fragment>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <Link
          to="/dashboard/products/add"
          className="flex items-center gap-2 bg-[#0f1c3c] text-white py-2 px-4 rounded-lg hover:bg-[#162b5b] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Create Product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                PRODUCT
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                PRICE
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                LOCATION
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                CONDITION
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                CATEGORY
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product._id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {/* Image with slider */}
                    <div className="h-16 w-16 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden relative group">
                      <img
                        src={
                          product.images[getCurrentImageIndex(product._id)] ||
                          "/placeholder.svg"
                        }
                        alt={product.name}
                        className="h-16 w-16 object-cover"
                      />

                      {/* Image counter */}
                      {product.images.length > 1 && (
                        <div className="absolute bottom-0 right-0 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded-tl-md">
                          {getCurrentImageIndex(product._id) + 1}/
                          {product.images.length}
                        </div>
                      )}

                      {/* Navigation arrows - only show on hover if multiple images */}
                      {product.images.length > 1 && (
                        <div className="absolute inset-0 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              prevImage(product._id);
                            }}
                            className="bg-black bg-opacity-50 text-white p-1 rounded-full ml-1 hover:bg-opacity-70"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              nextImage(product._id);
                            }}
                            className="bg-black bg-opacity-50 text-white p-1 rounded-full mr-1 hover:bg-opacity-70"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Posted: {product.postedDate}
                      </div>

                      {/* Thumbnail indicators */}
                      {product.images.length > 1 && (
                        <div className="flex mt-1 space-x-1">
                          {product.images.map((_, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImageIndex((prev) => ({
                                  ...prev,
                                  [product._id]: index,
                                }));
                              }}
                              className={`w-1.5 h-1.5 rounded-full ${
                                index === getCurrentImageIndex(product._id)
                                  ? "bg-[#0f1c3c]"
                                  : "bg-gray-300"
                              }`}
                              aria-label={`View image ${index + 1}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.condition === "New"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {product.condition}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Link
                      to={`/dashboard/products/${product._id}/edit`}
                      className="text-[#0f1c3c] hover:text-[#162b5b] bg-gray-100 p-2 rounded-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => deleteHandler(product._id)}
                      className="text-white bg-red-500 hover:bg-red-600 p-2 rounded-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
};

export default ProductListScreen;
