import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Forgetpassword: React.FC = () => {
  const navigate = useNavigate();

  // 1. State Management
  const [email, setEmail] = useState("");

  // 2. Form Submission Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in with:", { email });

    navigate("/OTPPage");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-10 shadow-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Forgot password
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-xl bg-[#0f1d33] py-3 font-semibold text-white shadow-md transition-all hover:bg-[#0b1527] active:scale-[0.98]"
          >
            Sent code
          </button>
        </form>
      </div>
    </div>
  );
};

export default Forgetpassword;
