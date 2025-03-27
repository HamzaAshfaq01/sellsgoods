import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../axios";
import DeleteConfirmationModal from "../../components/DeleteConfirmation";
import { FaSpinner } from "react-icons/fa";

const CategoryListScreen = () => {
    const [initialLoading, setInitialLoading] = useState(true);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;
    const limit = pageSize;

    const currentCategories = categories;


    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const fetchCategories = async (currentPage, limit) => {
        try {
            setLoading(true);
            const response = await axios.get("/category/listingCategories", {
                params: { page: currentPage, limit: limit }
            });
    
            if (response.status === 200) {
                setCategories(response.data.categories);
                setTotalPages(response.data.totalPages);
                console.log(`Page ${currentPage} Data:`, response.data.categories);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Failed to load categories");
            setCategories([]);
        } finally {
            setLoading(false);
            setInitialLoading(false);
        }
    };
    

    useEffect(() => {
        fetchCategories(currentPage, limit);
    }, [currentPage, limit]);

    const handleDeleteConfirm = async () => {
        if (!categoryToDelete) return;
        setIsDeleting(true);
        try {
            const response = await axios.delete(`/category/${categoryToDelete._id}`);
            if (response.status === 200) {
                setCategories(categories.filter(c => c._id !== categoryToDelete._id));
                toast.success("Category deleted successfully");
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error(error.response?.data?.message || "Failed to delete category");
        } finally {
            setIsDeleting(false);
            closeDeleteModal();
        }
    };

    const openDeleteModal = (category) => {
        setCategoryToDelete(category);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setCategoryToDelete(null);
    };

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    const Pagination = () => {
        const totalButtons = 5; 
        const getPageNumbers = () => {
          let start = Math.max(1, currentPage - Math.floor(totalButtons / 2));
          let end = Math.min(totalPages, start + totalButtons - 1);
      
          if (end - start < totalButtons - 1) {
            start = Math.max(1, end - totalButtons + 1);
          }
      
          let pages = [];
          if (start > 1) pages.push(1);
          if (start > 2) pages.push("...");
      
          for (let i = start; i <= end; i++) {
            pages.push(i);
          }
      
          if (end < totalPages - 1) pages.push("...");
          if (end < totalPages) pages.push(totalPages);
      
          return pages;
        };
      
        return (
          <div className="flex justify-center items-center space-x-2 mt-10 mb-4">
          <button
      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
        currentPage === 1 || loading ? "bg-none text-gray-500 cursor-not-allowed" : "bg-none text-[#0f1c3c] hover:bg-[#0f1c3c] hover:text-gray-300 cursor-pointer"
      }`}
      disabled={currentPage === 1 || loading}
      onClick={() => handlePageChange(currentPage - 1)}
    >
      &lt;
    </button>
    
    {getPageNumbers().map((page, index) => (
      <button
        key={index}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
          currentPage === page
            ? "bg-[#0f1c3c] text-white font-bold cursor-pointer"
            : "bg-gray-200 cursor-pointer hover:bg-gray-300"
        } ${page === "..." ? "cursor-pointer text-gray-500 bg-transparent" : ""}`}
        onClick={() => page !== "..." && handlePageChange(page)}
        disabled={page === "..." || loading}
      >
        {loading && currentPage === page ? (
          <span className="animate-spin">...</span> 
        ) : (
          page
        )}
      </button>
    ))}
    
    <button
      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
        currentPage === totalPages || loading ? "bg-none text-gray-500 cursor-not-allowed" : "bg-none text-[#0f1c3c] hover:bg-[#0f1c3c] hover:text-gray-300 cursor-pointer"
      }`}
      disabled={currentPage === totalPages || loading}
      onClick={() => handlePageChange(currentPage + 1)}
    >
      &gt;
    </button>
          </div>
        );
        
      };

    return (
        <React.Fragment>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
                <Link to="/dashboard/categories/add" className="flex items-center gap-2 bg-[#0f1c3c] text-white py-2 px-4 rounded-lg hover:bg-[#162b5b] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create Category
                </Link>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                {initialLoading ? (
                    <div className="flex justify-center items-center my-4">
                        <FaSpinner className="animate-spin text-4xl text-[#0f1c3c]" />
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CATEGORY</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentCategories.map((category) => (
                                <tr key={category._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category._id}</td>
                                    <td className="px-2 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                                <div className="text-sm text-gray-500">Created: {formatDate(category.createdAt)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            <Link to={`/dashboard/categories/${category._id}/edit`} className="text-[#0f1c3c] hover:text-[#162b5b] bg-gray-100 p-2 rounded-md">     <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg></Link>
                                            <button onClick={() => openDeleteModal(category)} className="text-white bg-red-500 hover:bg-red-600 p-2 rounded-md">     <svg
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
                          </svg></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <DeleteConfirmationModal isOpen={deleteModalOpen} onClose={closeDeleteModal} onConfirm={handleDeleteConfirm} itemName={categoryToDelete?.name || ""} isDeleting={isDeleting} />

            <Pagination current={currentPage} pageSize={pageSize} total={categories.length} onChange={handlePageChange} />
        </React.Fragment>
    );
};

export default CategoryListScreen;
