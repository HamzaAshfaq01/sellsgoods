import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const JazzCashCheckout = () => {
  const { state: orderData } = useLocation();
  const navigate = useNavigate();
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const backendURL = "https://b3a6-182-189-15-42.ngrok-free.app";

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     if (!accountNumber || accountNumber.length < 11) {
//       toast.error("Please enter a valid JazzCash account number.");
//       return;
//     }
  
//     try {
//       setLoading(true);
  
//       const updatedOrderData = {
//         ...orderData,
//         accountNumber, 
//       };
  
//       const { data } = await axios.post(`${backendURL}/api/jazzCash/initiate`, updatedOrderData);
//       console.log("Response data:", data); // Log the response to check if paymentURL exists
  
//       // Ensure paymentURL exists
//       if (!data.paymentURL) {
//         toast.error("No payment URL received.");
//         return;
//       }
  
//       // Dynamically create the form for JazzCash payment
//       const form = document.createElement("form");
//       form.method = "POST";
//       form.action = data.paymentURL;
  
//       // Add hidden input fields to the form
//       for (let key in data.fields) {
//         const input = document.createElement("input");
//         input.type = "hidden";
//         input.name = key;
//         input.value = data.fields[key];
//         form.appendChild(input);
//       }
  
//       document.body.appendChild(form);
//       form.submit();
//     } catch (err) {
//       console.error("JazzCash error:", err);
//       toast.error("Payment initialization failed.");
//       navigate("/cart");
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   if (!orderData) {
//     return <p className="p-6 text-center text-red-500">Invalid order data.</p>;
//   }

  const handlePayment = async () => {
    try {
      const response = await axios.post(
        'https://7f2a-182-189-15-42.ngrok-free.app/api/jazzCash/initiate-payment',
        { amount: 100, phoneNumber: '03367312010' }
      );

      console.log("routeee repeponseee", response)
      
      // Submit form to JazzCash
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = response.data.paymentUrl;
      
      Object.entries(response.data.params).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });
      
      document.body.appendChild(form);
      form.submit();
      
    } catch (error) {
      console.error('Payment error:', error);
    }
  };
  
  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded shadow">
      {/* <h1 className="text-xl font-semibold text-gray-800 mb-4">JazzCash Payment</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mb-4">
          <span className="text-gray-700">JazzCash Account Number</span>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="w-full mt-1 border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="03XXXXXXXXX"
            required
          />
        </label> */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0f1c3c] text-white py-3 rounded hover:bg-[#162b5b] transition"
          onClick={handlePayment}
        >
          {loading ? "Processing..." : `Pay PKR ${orderData.total.toLocaleString()}`}
        </button>   
      {/* </form> */}
    </div>
  );
};

export default JazzCashCheckout;
