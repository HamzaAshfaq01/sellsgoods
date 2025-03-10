import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "../axios";

function ChangeInfo() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData =
      localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setName(userData.name || "");
      setEmail(userData.email || "");
      setPhone(userData.phone || "");
    }
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put("/users/profile", {
        name,
        email,
        phone,
      });
      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        setName(response.data.name);
        setEmail(response.data.email);
        setPhone(response.data.phone);
        const userData =
          localStorage.getItem("user") &&
          JSON.parse(localStorage.getItem("user"));
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...userData,
            name: response.data.name,
            email: response.data.email,
            phone: response.data.phone,
          })
        );
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(
          error.response.data.message ||
            "An error occurred while updating profile."
        );
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
    <form className="space-y-6" onSubmit={submitHandler}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700" htmlFor="email">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none border border-gray-200 transition-all focus:border-[#0f1c3c]"
          placeholder="Enter name"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700" htmlFor="email">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none border border-gray-200 transition-all focus:border-[#0f1c3c]"
          placeholder="Enter email"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700" htmlFor="phone">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
          }}
          className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none border border-gray-200 transition-all focus:border-[#0f1c3c]"
          placeholder="Enter phone number"
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="px-6 py-2 bg-[#0f1c3c] text-white rounded-lg hover:bg-[#162b5b] transition-colors"
        >
          {loading ? "Loading...." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

export default ChangeInfo;
