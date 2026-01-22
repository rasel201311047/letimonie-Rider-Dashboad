import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { CameraIcon } from "@heroicons/react/24/outline";

export default function EditProfile() {
  const fileRef = useRef<HTMLInputElement>(null);

  const [section, setSection] = useState<"edit" | "password">("edit");
  const [profile, setProfile] = useState({
    name: "Maria",
    role: "Admin",
    image: "https://i.ibb.co/gbkXZ3fz/user-3.png",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /* ---------- Handlers ---------- */
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setProfile({ ...profile, image: preview });
  };

  const handleProfileSave = () => {
    console.log("Profile Updated:", profile);
  };

  const handlePasswordSave = () => {
    console.log("Password Data:", passwords);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center py-10">
      {/* ===== Profile Header ===== */}
      <div className="w-[90%] max-w-4xl bg-[#32475B] rounded-xl py-6 px-8 flex items-center justify-center gap-6">
        <div className="relative">
          <img
            src={profile.image}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-4 border-white"
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow"
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
          <h2 className="text-white text-xl font-semibold">{profile.name}</h2>
          <p className="text-gray-300 text-sm">{profile.role}</p>
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
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#0F172A]"
              />
            </div>

            <button
              onClick={handleProfileSave}
              className="w-full bg-gradient-to-r from-[#053F53] to-[#0470949f] text-white py-2.5 rounded-md text-sm font-medium hover:opacity-90"
            >
              Save Changes
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
                className="w-full border rounded-md px-3 py-2 text-sm"
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
                className="w-full border rounded-md px-3 py-2 text-sm"
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
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>

            <button
              onClick={handlePasswordSave}
              className="w-full bg-gradient-to-r from-[#053F53] to-[#0470949f] text-white py-2.5 rounded-md text-sm font-medium hover:opacity-90"
            >
              Update Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
