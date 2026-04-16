import { useState, useRef, useEffect } from "react";
import {
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import type {
  SearchedUser,
  NotificationAudience,
} from "../../types/notificationtype";
import {
  useSendNotificationMutation,
  useSearchUsersQuery,
} from "../../rtkquery/page/notificationApi";

// ─── Debounce hook ───────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ─── Audience option map ──────────────────────────────────────────────────────
const AUDIENCE_OPTIONS: { label: string; value: NotificationAudience }[] = [
  { label: "All", value: "all" },
  { label: "Passenger", value: "passenger" },
  { label: "Driver", value: "driver" },
  { label: "Specific User", value: "specific-user" },
];

export default function NotificationPage() {
  const [audience, setAudience] = useState<NotificationAudience>("all");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<SearchedUser | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(searchInput.trim(), 400);

  // ─── RTK Query ───────────────────────────────────────────────────────────────
  const { data: searchResult, isFetching: isSearching } = useSearchUsersQuery(
    debouncedSearch,
    {
      skip: debouncedSearch.length < 2 || audience !== "specific-user",
    },
  );

  const [sendNotification, { isLoading: isSending }] =
    useSendNotificationMutation();

  const users: SearchedUser[] = searchResult?.data?.data ?? [];

  // ─── Close dropdown on outside click ────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleAudienceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAudience(e.target.value as NotificationAudience);
    setSelectedUser(null);
    setSearchInput("");
    setShowDropdown(false);
  };

  const handleUserSelect = (user: SearchedUser) => {
    setSelectedUser(user);
    setShowDropdown(false);
    setSearchInput("");
  };

  const handleClearUser = () => {
    setSelectedUser(null);
    setSearchInput("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (audience === "specific-user" && !selectedUser) {
      toast.error("Please select a user first.");
      return;
    }

    const payload = {
      audience,
      title,
      message,
      receiver: audience === "specific-user" ? (selectedUser?._id ?? "") : "",
    };

    const toastId = toast.loading("Sending notification…");

    try {
      const res = await sendNotification(payload).unwrap();
      toast.success(res.message || "Notification sent successfully!", {
        id: toastId,
      });
      // Reset form
      setTitle("");
      setMessage("");
      setSelectedUser(null);
      setAudience("all");
      setSearchInput("");
    } catch (err: unknown) {
      const errorMessage =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to send notification.";
      toast.error(errorMessage, { id: toastId });
    }
  };

  const isSubmitDisabled =
    isSending || (audience === "specific-user" && !selectedUser);

  // ─── Render ──────────────────────────────────────────────────────────────────
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
              {AUDIENCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Specific User Selection */}
          {audience === "specific-user" && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Select User
              </label>

              {selectedUser ? (
                /* Selected user card */
                <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
                  <button
                    type="button"
                    onClick={handleClearUser}
                    className="absolute top-3 right-3 p-1 hover:bg-white rounded-full transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4 text-gray-500" />
                  </button>
                  <div className="flex items-start gap-3 pr-8">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {selectedUser.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {selectedUser.fullName}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {selectedUser.email}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        ID: {selectedUser._id}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-1">
                    ✓ Ready to send to {selectedUser.fullName} (
                    {selectedUser.email})
                  </p>
                </div>
              ) : (
                /* Search input + dropdown */
                <div className="relative" ref={dropdownRef}>
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    {isSearching && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        <svg
                          className="h-4 w-4 animate-spin text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          />
                        </svg>
                      </span>
                    )}
                    <input
                      type="text"
                      placeholder="Search by name, email, phone…"
                      value={searchInput}
                      onChange={(e) => {
                        setSearchInput(e.target.value);
                        setShowDropdown(true);
                      }}
                      onFocus={() => setShowDropdown(true)}
                      className="w-full pl-10 pr-10 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]"
                    />
                  </div>

                  {showDropdown && debouncedSearch.length >= 2 && (
                    <div className="absolute z-20 w-full mt-1 bg-white rounded-lg border border-gray-200 shadow-lg max-h-80 overflow-y-auto">
                      {isSearching ? (
                        <div className="p-6 text-center text-sm text-gray-400">
                          Searching…
                        </div>
                      ) : users.length > 0 ? (
                        <>
                          <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500">
                              {searchResult?.data?.total ?? 0} user(s) found
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowDropdown(false)}
                              className="text-xs text-gray-400 hover:text-gray-600"
                            >
                              Close
                            </button>
                          </div>
                          <div className="divide-y divide-gray-50">
                            {users.map((user) => (
                              <button
                                key={user._id}
                                type="button"
                                onClick={() => handleUserSelect(user)}
                                className="w-full text-left p-3 hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                                    <span className="text-white text-xs font-medium">
                                      {user.fullName.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {user.fullName}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                      {user.email} · {user.phone}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                      {user.accountId}
                                    </p>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="p-8 text-center">
                          <MagnifyingGlassIcon className="mx-auto h-10 w-10 text-gray-300" />
                          <p className="mt-2 text-sm text-gray-500">
                            No users found for &quot;{debouncedSearch}&quot;
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Try a different name, email or phone
                          </p>
                        </div>
                      )}
                    </div>
                  )}
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
              placeholder="Enter notification title…"
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
              placeholder="Write your notification message here…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-lg bg-gray-100 border border-gray-200 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#053F53] to-[#047094] py-3 text-sm font-medium text-white transition ${
              isSubmitDisabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-90"
            }`}
          >
            {isSending ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Sending…
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="h-4 w-4" />
                {audience === "specific-user"
                  ? selectedUser
                    ? `Send to ${selectedUser.fullName.split(" ")[0]}`
                    : "Select a user to send"
                  : "Send Notification"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
