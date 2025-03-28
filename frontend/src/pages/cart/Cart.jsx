import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import axios from "../../axios";
import { toast } from "react-toastify";

const Cart = () => {
  const { cart, updateCart } = useCart();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleQuantityChange = (productId, newQuantity) => {
    const updatedCart = cart.map(item =>
      item.id === productId ? { ...item, quantity: Math.max(1, newQuantity) } : item
    );
    updateCart(updatedCart);
  };

  const removeItem = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    updateCart(updatedCart);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (!user || !user.token) {
      toast.error("Please log in to proceed to checkout.");
      navigate("/login");
      return;
    }
  
    // Ensure required fields are included
    const buyerId = user?.id || user?._id;
    if (!buyerId) {
      toast.error("User ID is missing. Please log in again.");
      return;
    }
  
    const items = cart.map(item => ({
      productId: item.id,
      title: item.title,
      quantity: item.quantity,
      price: item.price,
      image: item.image,
      sellerId: item.sellerId, 
    }));
  
    if (items.some(item => !item.sellerId)) {
      console.error("Missing sellerId in some items:", items);
      toast.error("Some products are missing seller information. Try again.");
      return;
    }
  
    const orderData = {
      buyerId,
      sellerId: items[0].sellerId, // Assuming one seller per order
      customerName: user?.name || "Unknown",
      email: user?.email || "unknown@example.com",
      phoneNumber: user?.phone || "0000000000",
      items,
      subtotal: calculateTotal(),
      tax: calculateTotal() * 0.1,
      shipping: calculateTotal() * 0.05,
      total: calculateTotal() * 1.15,
      status: "Pending"
    };
  
    console.log("Order Data Before Sending:", orderData); // Debugging
  
    try {
      const { data, status } = await axios.post(
        `/orders`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
  
      if (status === 201) {
        toast.success("Order placed successfully!");
        updateCart([]);
        navigate("/orders");
      }
    } catch (error) {
      console.error("Order Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to place order.");
    }
  };
  
  

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
          <Link
            to="/"
            className="bg-[#0f1c3c] text-white px-6 py-3 rounded-lg hover:bg-[#162b5b] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 col-span-1 space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-6 flex gap-6">
              <img
                src={item.image ? `${import.meta.env.VITE_API_SERVER_UPLOADS}${item.image}` : '/placeholder.svg'}
                alt={item.title}
                className="w-full max-w-32 h-32 object-contain rounded-lg"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-lg font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-800">
                      PKR {(item.price * item.quantity).toLocaleString()}
                    </p>
                    <p className="text-gray-500">PKR {item.price.toLocaleString()} each</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

    
        <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal ({cart.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
              <span className="font-medium">PKR {calculateTotal().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxes (10%)</span>
              <span className="font-medium">PKR {(calculateTotal() * 0.1).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">PKR {(calculateTotal() * 0.05).toLocaleString()}</span>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between mb-6">
              <span className="text-xl font-bold">Total</span>
              <span className="text-xl font-bold text-[#0f1c3c]">
                PKR {(calculateTotal() * 1.15).toLocaleString()}
              </span>
            </div>

            <button
              className="w-full bg-[#0f1c3c] text-white py-3 rounded-lg hover:bg-[#162b5b] transition-colors"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
