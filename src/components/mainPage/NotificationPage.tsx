import { useState } from "react";
import {
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// Dummy user data
const dummyUsers = [
  {
    id: "USR-001",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Passenger",
  },
  {
    id: "USR-002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Passenger",
  },
  {
    id: "USR-003",
    name: "Robert Johnson",
    email: "robert.j@example.com",
    role: "Driver",
  },
  {
    id: "USR-004",
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    role: "Passenger",
  },
  {
    id: "USR-005",
    name: "Michael Brown",
    email: "michael.b@example.com",
    role: "Driver",
  },
  {
    id: "USR-006",
    name: "Emily Davis",
    email: "emily.d@example.com",
    role: "Passenger",
  },
  {
    id: "USR-007",
    name: "David Wilson",
    email: "david.w@example.com",
    role: "Passenger",
  },
  {
    id: "USR-008",
    name: "Lisa Anderson",
    email: "lisa.a@example.com",
    role: "Driver",
  },
  {
    id: "USR-009",
    name: "James Taylor",
    email: "james.t@example.com",
    role: "Passenger",
  },
  {
    id: "USR-010",
    name: "Maria Garcia",
    email: "maria.g@example.com",
    role: "Passenger",
  },
];

export default function NotificationPage() {
  const [audience, setAudience] = useState("All");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<
    (typeof dummyUsers)[0] | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const filteredUsers = dummyUsers.filter(
    (user) =>
      user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const notificationData = {
      audience,
      title,
      message,
      ...(audience === "Specific User" &&
        selectedUser && {
          userId: selectedUser.id,
          userName: selectedUser.name,
          userEmail: selectedUser.email,
        }),
    };

    console.log(notificationData);
  };

  const handleAudienceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setAudience(value);
    if (value !== "Specific User") {
      setSelectedUser(null);
      setSearchQuery("");
    }
  };

  const handleUserSelect = (user: (typeof dummyUsers)[0]) => {
    setSelectedUser(user);
    setShowUserDropdown(false);
    setSearchQuery("");
  };

  const handleClearSelection = () => {
    setSelectedUser(null);
    setSearchQuery("");
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Create New Notification
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience
            </label>
            <select
              value={audience}
              onChange={handleAudienceChange}
              className="w-full rounded-lg bg-gray-100 border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]"
            >
              <option>All</option>
              <option>Passenger</option>
              <option>Driver</option>
              <option>Specific User</option>
            </select>
          </div>

          {/* Specific User Selection - Conditionally Rendered */}
          {audience === "Specific User" && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Select User
              </label>

              {/* Selected User Display */}
              {selectedUser ? (
                <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
                  <button
                    type="button"
                    onClick={handleClearSelection}
                    className="absolute top-3 right-3 p-1 hover:bg-white rounded-full transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4 text-gray-500" />
                  </button>

                  <div className="pr-8">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {selectedUser.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {selectedUser.name}
                          </h3>
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              selectedUser.role === "Driver"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {selectedUser.role}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 truncate">
                          {selectedUser.email}
                        </p>
                        <p className="text-xs font-medium text-gray-500 mt-1">
                          ID: {selectedUser.id}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* User Search Input */
                <div className="relative">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, email, ID, or role..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowUserDropdown(true);
                      }}
                      onFocus={() => setShowUserDropdown(true)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]"
                    />
                  </div>

                  {/* User Dropdown */}
                  {showUserDropdown && searchQuery && (
                    <div className="absolute z-10 w-full mt-1 bg-white rounded-lg border border-gray-200 shadow-lg max-h-96 overflow-y-auto">
                      <div className="p-2 border-b border-gray-100">
                        <div className="flex items-center justify-between px-2 py-1">
                          <span className="text-xs font-medium text-gray-500">
                            {filteredUsers.length} users found
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowUserDropdown(false)}
                            className="text-xs text-gray-500 hover:text-gray-700"
                          >
                            Close
                          </button>
                        </div>
                      </div>

                      <div className="divide-y divide-gray-100">
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <button
                              key={user.id}
                              type="button"
                              onClick={() => handleUserSelect(user)}
                              className="w-full text-left p-3 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex-shrink-0">
                                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                                    <span className="text-white text-xs font-medium">
                                      {user.name.charAt(0)}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {user.name}
                                    </p>
                                    <span
                                      className={`px-1.5 py-0.5 text-xs rounded-full ${
                                        user.role === "Driver"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-blue-100 text-blue-800"
                                      }`}
                                    >
                                      {user.role}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-600 truncate">
                                    {user.email}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    ID: {user.id}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="p-8 text-center">
                            <div className="mx-auto h-12 w-12 text-gray-400">
                              <MagnifyingGlassIcon className="h-12 w-12" />
                            </div>
                            <p className="mt-2 text-sm text-gray-500">
                              No users found for "{searchQuery}"
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Try searching by name, email, ID, or role
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Selected User Info */}
              {selectedUser && (
                <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
                  ✓ Ready to send notification to {selectedUser.name} (
                  {selectedUser.email})
                </div>
              )}
            </div>
          )}

          {/* Notification Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notification Title
            </label>
            <input
              type="text"
              placeholder="Enter notification title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg bg-gray-100 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]"
              required
            />
          </div>

          {/* Message Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message Content
            </label>
            <textarea
              rows={6}
              placeholder="Write your notification message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-lg bg-gray-100 border border-gray-200 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={audience === "Specific User" && !selectedUser}
            className={`w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#053F53] to-[#0470949f] py-3 text-sm font-medium text-white transition ${
              audience === "Specific User" && !selectedUser
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-90"
            }`}
          >
            <PaperAirplaneIcon className="h-4 w-4" />
            {audience === "Specific User"
              ? selectedUser
                ? `Send to ${selectedUser.name.split(" ")[0]}`
                : "Select a user to send"
              : "Send Notification"}
          </button>
        </form>
      </div>
    </div>
  );
}
