import React, { useEffect, useState } from "react";
import axios from "../../axios";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import DeleteConfirmationModal from "../../components/DeleteConfirmation";
import { Link } from "react-router-dom";

const ComplaintListScreen = () => {
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(""); // "edit" or "delete"

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/complaints");
      setComplaints(res.data); // Assuming your response contains a list of complaints
    } catch (err) {
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const openDeleteModal = (complaint) => {
    setSelectedComplaint(complaint);
    setModalAction("delete");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedComplaint(null);
    setModalAction("");
  };

  const handleDeleteConfirm = async () => {
    if (!selectedComplaint) return;
    setIsProcessing(true);

    try {
      await axios.delete(`/complaints/${selectedComplaint._id}`);
      toast.success("Complaint deleted successfully");
      fetchComplaints();
    } catch (err) {
      toast.error("Failed to delete complaint");
    } finally {
      setIsProcessing(false);
      closeModal();
    }
  };

  const handleEdit = (complaint) => {
    // Placeholder for Edit functionality
    // You can add your edit logic here, for now it just logs the complaint
    console.log("Edit complaint:", complaint);
    toast.info("Edit functionality is not implemented yet.");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Complaints</h1>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        {loading ? (
          <div className="flex justify-center my-4">
            <FaSpinner className="animate-spin text-4xl text-[#0f1c3c]" />
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {complaints.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">{c.order?._id || "Deleted"}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.reportedBy?.email}</td>
                  <td className="px-6 py-4 text-sm">{c.reason}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {c.status || "No status"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                    <Link
                          to={`/dashboard/complaints/${c?._id}/edit`}
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

      <DeleteConfirmationModal
        isOpen={modalOpen}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        itemName={`Delete complaint for order: ${selectedComplaint?.order?._id}`}
        isDeleting={isProcessing}
      />
    </div>
  );
};

export default ComplaintListScreen;
