import React, { useEffect, useState } from "react";
import axios from "../../axios";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import DeleteConfirmationModal from "../../components/DeleteConfirmation";

const UsersListScreen = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get("/users");
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!userToDelete) return;
        setIsDeleting(true);
        try {
            await axios.delete(`/users/${userToDelete._id}`);
            setUsers(users.filter(u => u._id !== userToDelete._id));
            toast.success("User deleted successfully");
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user");
        } finally {
            setIsDeleting(false);
            closeDeleteModal();
        }
    };

    const openDeleteModal = (user) => {
        setUserToDelete(user);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setUserToDelete(null);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    };

    return (
        <React.Fragment>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Users</h1>
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user._id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => openDeleteModal(user)} className="text-white bg-red-500 hover:bg-red-600 p-2 rounded-md">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <DeleteConfirmationModal isOpen={deleteModalOpen} onClose={closeDeleteModal} onConfirm={handleDeleteConfirm} itemName={userToDelete?.name || ""} isDeleting={isDeleting} />
        </React.Fragment>
    );
};

export default UsersListScreen;
