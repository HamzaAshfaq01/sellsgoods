import { useState } from 'react';
import axios from "../../axios";

const ComplaintModal = ({ orderId, isOpen, onClose }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/complaints', { order: orderId, reason });
      setSuccess(true);
      setReason('');
      setTimeout(() => {
        setSuccess(false);
        onClose(); // Close modal
      }, 1500);
    } catch (err) {
      console.error('Error creating complaint:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">Report a Complaint</h2>

        {success ? (
          <div className="text-green-600 font-medium">Complaint submitted successfully!</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Reason for Complaint:
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Explain the issue clearly..."
            ></textarea>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
            >
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ComplaintModal;
