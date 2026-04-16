import { useRef, useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { CameraIcon } from "@heroicons/react/24/outline";

import toast from "react-hot-toast";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useChangeProfileImageMutation,
} from "../../rtkquery/page/profileApi";

export default function EditProfile() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [section, setSection] = useState<"edit" | "password">("edit");

  /* ---------- RTK Query hooks ---------- */
  const { data: profileData, isLoading: profileLoading } = useGetProfileQuery();

  const [updateProfile, { isLoading: updatingProfile }] =
    useUpdateProfileMutation();
  const [changePassword, { isLoading: changingPassword }] =
    useChangePasswordMutation();
  const [changeProfileImage, { isLoading: uploadingImage }] =
    useChangeProfileImageMutation();

  /* ---------- Local state ---------- */
  const [name, setName] = useState("");

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Sync fetched profile name into local state
  useEffect(() => {
    if (profileData?.data?.name) {
      setName(profileData.data.name);
    }
  }, [profileData]);

  /* ---------- Handlers ---------- */

  // Upload image immediately on file select
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_image", file);

    try {
      const res = await changeProfileImage(formData).unwrap();
      toast.success(res.message || "Profile image updated!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update image.");
    }
  };

  // Save name update
  const handleProfileSave = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    try {
      const res = await updateProfile({ fullName: name }).unwrap();
      toast.success(res.message || "Profile updated!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile.");
    }
  };

  // Save password change
  const handlePasswordSave = async () => {
    if (
      !passwords.currentPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    try {
      const res = await changePassword({
        oldPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      }).unwrap();
      toast.success(res.message || "Password changed successfully!");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to change password.");
    }
  };

  /* ---------- Derived values ---------- */
  const avatar =
    profileData?.data?.avatar || "https://i.ibb.co/gbkXZ3fz/user-3.png";
  const role = profileData?.data?.role || "Admin";

  if (profileLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center py-10">
      {/* ===== Profile Header ===== */}
      <div className="w-[90%] max-w-4xl bg-[#32475B] rounded-xl py-6 px-8 flex items-center justify-center gap-6">
        <div className="relative">
          <img
            src={avatar}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-4 border-white"
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploadingImage}
            className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow disabled:opacity-60"
          >
            <CameraIcon className="w-4 h-4 text-gray-700" />
          </button>
          <input
            type="file"
            ref={fileRef}
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <div>
          <h2 className="text-white text-xl font-semibold">
            {name || profileData?.data?.name}
          </h2>
          <p className="text-gray-300 text-sm capitalize">{role}</p>
        </div>
      </div>

      {/* ===== Tabs ===== */}
      <div className="flex gap-8 mt-8 text-sm font-medium">
        <button
          onClick={() => setSection("edit")}
          className={`pb-1 ${
            section === "edit"
              ? "border-b-2 border-[#0F172A] text-[#0F172A]"
              : "text-gray-400"
          }`}
        >
          Edit Profile
        </button>

        <button
          onClick={() => setSection("password")}
          className={`pb-1 ${
            section === "password"
              ? "border-b-2 border-[#0F172A] text-[#0F172A]"
              : "text-gray-400"
          }`}
        >
          Change Password
        </button>
      </div>

      {/* ===== Edit Profile ===== */}
      {section === "edit" && (
        <div className="mt-8 w-full max-w-md bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-6">Edit Your Profile</h3>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">
                User Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#0F172A] outline-none"
              />
            </div>

            <button
              onClick={handleProfileSave}
              disabled={updatingProfile}
              className="w-full bg-gradient-to-r from-[#053F53] to-[#0470949f] text-white py-2.5 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-60"
            >
              {updatingProfile ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* ===== Change Password ===== */}
      {section === "password" && (
        <div className="mt-8 w-full max-w-md bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-6">Change Password</h3>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={passwords.currentPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0F172A]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                New Password
              </label>
              <input
                type="password"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0F172A]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0F172A]"
              />
            </div>

            <button
              onClick={handlePasswordSave}
              disabled={changingPassword}
              className="w-full bg-gradient-to-r from-[#053F53] to-[#0470949f] text-white py-2.5 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-60"
            >
              {changingPassword ? "Updating…" : "Update Password"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
