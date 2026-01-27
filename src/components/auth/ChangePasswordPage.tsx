import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    if (newPassword === currentPassword) {
      alert("New password cannot be the same as current password!");
      return;
    }

    console.log("Password updated:", { currentPassword, newPassword });

    alert("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    navigate("/dashboard");
  };

  const renderPasswordField = (
    label: string,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    show: boolean,
    setShow: React.Dispatch<React.SetStateAction<boolean>>
  ) => (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="********"
          required
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? (
            <EyeSlashIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter your current password and choose a new one
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderPasswordField(
            "Current Password",
            currentPassword,
            setCurrentPassword,
            showCurrent,
            setShowCurrent
          )}
          {renderPasswordField(
            "New Password",
            newPassword,
            setNewPassword,
            showNew,
            setShowNew
          )}
          {renderPasswordField(
            "Confirm New Password",
            confirmPassword,
            setConfirmPassword,
            showConfirm,
            setShowConfirm
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-[#0f1d33] py-3 font-semibold text-white shadow-md transition-all hover:bg-[#0b1527] active:scale-[0.98]"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
