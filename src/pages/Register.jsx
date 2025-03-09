import { useState } from "react";
import { Link } from "react-router-dom";

const LoginScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");

  const submitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          Register
        </h1>

        <form className="flex flex-col gap-5" onSubmit={submitHandler}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none  border border-gray-200 transition-all"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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

          {/* Role Selection */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">
              Select Role
            </span>
            <div className="flex justify-between gap-4">
              <label
                className={`flex items-center gap-2 cursor-pointer bg-gray-100 border  rounded-lg p-3 w-full hover:bg-gray-200 transition-all ${
                  role === "buyer" ? "border-[#0f1c3c]" : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="buyer"
                  checked={role === "buyer"}
                  onChange={() => setRole("buyer")}
                  className="hidden"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 ${
                    role === "buyer"
                      ? "bg-white border-[#0f1c3c]"
                      : "border-gray-400"
                  }`}
                />
                <span className="text-gray-700 font-medium">Buyer</span>
              </label>

              <label
                className={`flex items-center gap-2 cursor-pointer bg-gray-100 border  rounded-lg p-3 w-full hover:bg-gray-200 transition-all ${
                  role === "seller" ? "border-[#0f1c3c]" : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="seller"
                  checked={role === "seller"}
                  onChange={() => setRole("seller")}
                  className="hidden"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 ${
                    role === "seller"
                      ? "bg-white border-[#0f1c3c]"
                      : "border-gray-400"
                  }`}
                />
                <span className="text-gray-700 font-medium">Seller</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0f1c3c] text-white py-2 px-4 rounded-lg cursor-pointer transition-all hover:bg-[#162b5b]"
          >
            Register
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-[#0f1c3c] hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
