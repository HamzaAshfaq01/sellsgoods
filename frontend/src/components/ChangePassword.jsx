import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "../axios";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put("/users/profile/change-password", {
        oldPassword,
        newPassword,
      });
      if (response.status === 200) {
        toast.success("Password updated successfully.");
        setNewPassword("");
        setOldPassword("");
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(
          error.response.data.message ||
            "An error occurred while updating password."
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
    <React.Fragment>
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        Change Password
      </h3>
      <form className="space-y-6" onSubmit={submitHandler}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="oldPassword"
            >
              Old Password
            </label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none border border-gray-200 transition-all focus:border-[#0f1c3c]"
              placeholder="Enter old password"
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="newPassword"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none border border-gray-200 transition-all focus:border-[#0f1c3c]"
              placeholder="Enter new password"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#0f1c3c] text-white rounded-lg hover:bg-[#162b5b] transition-colors"
          >
            {loading ? "Loading...." : "Save Changes"}
          </button>
        </div>
      </form>
    </React.Fragment>
  );
}

export default ChangePassword;
