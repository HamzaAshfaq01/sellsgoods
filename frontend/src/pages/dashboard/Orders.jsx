import React, { useEffect, useState } from "react";
import axios from "../../axios"
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "../../components/DeleteConfirmation";
import { FaSpinner } from "react-icons/fa";

const OrdersListScreen = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get("/orders");
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!orderToDelete) return;
        setIsDeleting(true);
        try {
            await axios.delete(`http://localhost:5000/api/orders/${orderToDelete._id}`);
            setOrders(orders.filter(o => o._id !== orderToDelete._id));
            toast.success("Order deleted successfully");
        } catch (error) {
            console.error("Error deleting order:", error);
            toast.error("Failed to delete order");
        } finally {
            setIsDeleting(false);
            closeDeleteModal();
        }
    };

    const openDeleteModal = (order) => {
        setOrderToDelete(order);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setOrderToDelete(null);
    };

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending": return "bg-yellow-200 text-yellow-800";
            case "Shipped": return "bg-blue-200 text-blue-800";
            case "Delivered": return "bg-green-200 text-green-800";
            case "Cancelled": return "bg-red-200 text-red-800";
            default: return "bg-gray-200 text-gray-800";
        }
    };

    return (
        <React.Fragment>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                {loading ? (
                    <div className="flex justify-center items-center my-4">
                        <FaSpinner className="animate-spin text-4xl text-[#0f1c3c]" />
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone #</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order._id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customerName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.items.length > 0 && order.items[0].productId?.location?.area},  {order.items.length > 0 && order.items[0].productId?.location?.city}

                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.phoneNumber}</td>
                                    <td className="px-4 py-4 justify-center whitespace-nowrap text-sm font-medium">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            <Link to={`/dashboard/orders/${order._id}/edit`} className="text-[#0f1c3c] hover:text-[#162b5b] bg-gray-100 p-2 rounded-md">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                            </Link>
                                            <button onClick={() => openDeleteModal(order)} className="text-white bg-red-500 hover:bg-red-600 p-2 rounded-md">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <DeleteConfirmationModal isOpen={deleteModalOpen} onClose={closeDeleteModal} onConfirm={handleDeleteConfirm} itemName={orderToDelete?._id || ""} isDeleting={isDeleting} />
        </React.Fragment>
    );
};

export default OrdersListScreen;
