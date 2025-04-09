import { useState } from 'react';
import axios from "../../axios";

const ComplaintModal = ({ orderId, isOpen, onClose }) => {
  const [reason, setReason] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setImages(prev => [...prev, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append('order', orderId);
    formData.append('reason', reason);
    
    // Append images to FormData
    images.forEach(image => {
      formData.append('images', image);
    });

    try {
      const res = await axios.post('/complaints', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(true);
      setReason('');
      setImages([]);

      setTimeout(() => {
        setSuccess(false);
        onClose(); 
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

            <label className="block mt-4 mb-2 text-sm font-medium text-gray-700">
              Upload Images (optional):
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full"
            />

            {images.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {images.map((img, idx) => (
                  <div key={idx} className="w-16 h-16 relative">
                    <img
                      src={URL.createObjectURL(img)} // Display image preview
                      alt={`uploaded-${idx}`}
                      className="w-full h-full object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImages(images.filter((_, i) => i !== idx));
                      }}
                      className="absolute top-0 right-0 text-white bg-black/50 p-1 rounded-full"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

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
