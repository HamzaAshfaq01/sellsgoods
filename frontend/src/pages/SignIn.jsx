import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../axios";

const LoginScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/users/login", {
        email,
        password,
      });
      toast.success("User successfully loggedin");
      navigate("/dashboard/profile");
      localStorage.setItem("access_token", JSON.stringify(response.data.token));
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Registration failed.");
      } else if (error.request) {
        toast.error("No response from server. Please try again.");
      } else {
        toast.error("Error occurred while making the request.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          Sign In
        </h1>

        <form className="flex flex-col gap-5" onSubmit={submitHandler}>
          <div className="flex flex-col gap-2">
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none  border border-gray-200 transition-all"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none  border border-gray-200 transition-all"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0f1c3c] text-white py-2 px-4 rounded-lg cursor-pointer transition-all hover:bg-[#162b5b]"
          >
            {loading ? "Loading...." : "Sign In"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#0f1c3c] hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
