import { User } from "lucide-react";
import React, { useState, useMemo } from "react";

const PAGE_SIZE = 5;

interface Rider {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  rides: number;
  spent: number;
  joined: string;
  plan: "Basic" | "Standard" | "Premium" | "Enterprise" | "Lifetime";
  subscriptionRequest: "Pending" | "Approved" | "Rejected";
  status: "Active" | "Blocked";
  planExpiration?: string; // Add this line - expiration date in format "YYYY-MM-DD"
  details?: {
    address: string;
    vehicle: string;
    paymentMethod: string;
    lastLogin: string;
    averageRating: number;
  };
}

type PlanType = "Basic" | "Standard" | "Premium" | "Enterprise" | "Lifetime";
type NotificationType = "inapp" | "chat" | "email";

interface NotificationState {
  isSending: boolean;
  sentTo: string[];
  lastSent?: string;
}

const initialRiders: Rider[] = [
  {
    id: "R-56",
    name: "Pierre Martin",
    email: "pierre.m@email.com",
    phone: "+33 6 12 34 56 78",
    location: "Paris, France",
    rides: 15,
    spent: 106,
    joined: "12-07-2025",
    plan: "Basic",
    planExpiration: "2025-12-31",
    subscriptionRequest: "Pending",
    status: "Active",
    details: {
      address: "123 Champs-Élysées, Paris",
      vehicle: "Tesla Model 3",
      paymentMethod: "Visa **** 4321",
      lastLogin: "2 hours ago",
      averageRating: 4.8,
    },
  },
  {
    id: "R-26",
    name: "Marie Laurent",
    email: "marie.l@email.com",
    phone: "+33 6 12 34 56 78",
    location: "Lyon, France",
    rides: 20,
    spent: 108,
    joined: "12-04-2025",
    plan: "Standard",
    planExpiration: "2026-01-15",
    subscriptionRequest: "Approved",
    status: "Active",
    details: {
      address: "45 Rue de la République, Lyon",
      vehicle: "BMW X5",
      paymentMethod: "Mastercard **** 8765",
      lastLogin: "1 day ago",
      averageRating: 4.5,
    },
  },
  {
    id: "R-59",
    name: "Jean Dupont",
    email: "jean.d@email.com",
    phone: "+33 6 23 45 67 89",
    location: "Marseille, France",
    rides: 62,
    spent: 200,
    joined: "12-07-2025",
    plan: "Premium",
    planExpiration: "2026-03-20",
    subscriptionRequest: "Rejected",
    status: "Blocked",
    details: {
      address: "78 Vieux Port, Marseille",
      vehicle: "Mercedes E-Class",
      paymentMethod: "PayPal",
      lastLogin: "1 week ago",
      averageRating: 4.2,
    },
  },
  {
    id: "R-84",
    name: "Sophie Bernard",
    email: "sophie.b@email.com",
    phone: "+33 6 34 56 78 90",
    location: "Toulouse, France",
    rides: 13,
    spent: 205,
    joined: "12-06-2025",
    plan: "Lifetime",
    subscriptionRequest: "Pending",
    status: "Active",
    details: {
      address: "12 Place du Capitole, Toulouse",
      vehicle: "Toyota Prius",
      paymentMethod: "Apple Pay",
      lastLogin: "3 hours ago",
      averageRating: 4.9,
    },
  },
  {
    id: "R-36",
    name: "Thomas Petit",
    email: "thomas.p@email.com",
    phone: "+33 6 45 67 89 01",
    location: "Nice, France",
    rides: 5,
    spent: 100,
    joined: "05-11-2025",
    plan: "Standard",
    planExpiration: "2025-11-30",
    subscriptionRequest: "Approved",
    status: "Blocked",
    details: {
      address: "34 Promenade des Anglais, Nice",
      vehicle: "Honda Civic",
      paymentMethod: "Visa **** 1234",
      lastLogin: "2 days ago",
      averageRating: 4.0,
    },
  },
  {
    id: "R-45",
    name: "Julie Moreau",
    email: "julie.m@email.com",
    phone: "+33 6 56 78 90 12",
    location: "Bordeaux, France",
    rides: 16,
    spent: 506,
    joined: "12-07-2025",
    plan: "Enterprise",
    planExpiration: "2026-06-30",
    subscriptionRequest: "Pending",
    status: "Active",
    details: {
      address: "56 Quai des Chartrons, Bordeaux",
      vehicle: "Audi A6",
      paymentMethod: "Amex **** 5678",
      lastLogin: "5 hours ago",
      averageRating: 4.7,
    },
  },
  {
    id: "R-66",
    name: "David Leroy",
    email: "david.l@email.com",
    phone: "+33 6 67 89 01 23",
    location: "Lille, France",
    rides: 36,
    spent: 106,
    joined: "17-01-2025",
    plan: "Premium",
    planExpiration: "2026-02-28",
    subscriptionRequest: "Approved",
    status: "Active",
    details: {
      address: "89 Grand Place, Lille",
      vehicle: "Volkswagen Golf",
      paymentMethod: "Mastercard **** 9876",
      lastLogin: "1 hour ago",
      averageRating: 4.6,
    },
  },
  {
    id: "R-50",
    name: "Laura Simon",
    email: "laura.s@email.com",
    phone: "+33 6 78 90 12 34",
    location: "Strasbourg, France",
    rides: 78,
    spent: 600,
    joined: "15-07-2025",
    plan: "Lifetime",
    subscriptionRequest: "Approved",
    status: "Active",
    details: {
      address: "23 Rue des Orfèvres, Strasbourg",
      vehicle: "Tesla Model S",
      paymentMethod: "PayPal",
      lastLogin: "Just now",
      averageRating: 5.0,
    },
  },
  {
    id: "R-13",
    name: "Marc Dubois",
    email: "marc.d@email.com",
    phone: "+33 6 89 01 23 45",
    location: "Nantes, France",
    rides: 2,
    spent: 35,
    joined: "18-07-2025",
    plan: "Basic",
    planExpiration: "2025-08-15",
    subscriptionRequest: "Rejected",
    status: "Blocked",
    details: {
      address: "67 Île de Nantes, Nantes",
      vehicle: "Renault Clio",
      paymentMethod: "Visa **** 4321",
      lastLogin: "3 weeks ago",
      averageRating: 3.8,
    },
  },
  {
    id: "R-05",
    name: "Chloé Michel",
    email: "chloe.m@email.com",
    phone: "+33 6 90 12 34 56",
    location: "Montpellier, France",
    rides: 1,
    spent: 20,
    joined: "12-02-2025",
    plan: "Basic",
    planExpiration: "2025-09-10",
    subscriptionRequest: "Pending",
    status: "Active",
    details: {
      address: "45 Place de la Comédie, Montpellier",
      vehicle: "Peugeot 208",
      paymentMethod: "Apple Pay",
      lastLogin: "1 week ago",
      averageRating: 4.1,
    },
  },
];

interface StatusBadgeProps {
  value: "Active" | "Blocked";
  onChange: (value: "Active" | "Blocked") => void;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ value, onChange }) => {
  const isActive = value === "Active";

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as "Active" | "Blocked")}
      className={`px-3 py-1.5 rounded-full text-sm font-medium outline-none cursor-pointer transition-all border ${
        isActive
          ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
          : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
      }`}
    >
      <option value="Active">Active</option>
      <option value="Blocked">Blocked</option>
    </select>
  );
};

interface SubscriptionBadgeProps {
  value: "Pending" | "Approved" | "Rejected";
  onChange: (value: "Pending" | "Approved" | "Rejected") => void;
}

const SubscriptionBadge: React.FC<SubscriptionBadgeProps> = ({
  value,
  onChange,
}) => {
  const getStyles = () => {
    switch (value) {
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100";
      case "Approved":
        return "bg-green-50 text-green-700 border-green-200 hover:bg-green-100";
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200 hover:bg-red-100";
    }
  };

  return (
    <select
      value={value}
      onChange={(e) =>
        onChange(e.target.value as "Pending" | "Approved" | "Rejected")
      }
      className={`px-3 py-1.5 rounded-full text-sm font-medium outline-none cursor-pointer transition-all border ${getStyles()}`}
    >
      <option value="Pending">Pending</option>
      <option value="Approved">Approve</option>
      <option value="Rejected">Reject</option>
    </select>
  );
};

interface PlanSelectProps {
  value: PlanType;
  onChange: (value: PlanType) => void;
}

const PlanSelect: React.FC<PlanSelectProps> = ({ value, onChange }) => {
  const getPlanColor = (plan: PlanType) => {
    switch (plan) {
      case "Basic":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Standard":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Premium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Enterprise":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Lifetime":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as PlanType)}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium outline-none cursor-pointer transition-all border ${getPlanColor(
        value,
      )} hover:opacity-90`}
    >
      <option value="Basic">Basic</option>
      <option value="Standard">Standard</option>
      <option value="Premium">Premium</option>
      <option value="Enterprise">Enterprise</option>
      <option value="Lifetime">Lifetime</option>
    </select>
  );
};

interface PlanExpirationInputProps {
  plan: PlanType;
  expirationDate?: string;
  onExpirationChange: (date: string) => void;
}

const PlanExpirationInput: React.FC<PlanExpirationInputProps> = ({
  plan,
  expirationDate,
  onExpirationChange,
}) => {
  if (plan === "Lifetime") {
    return (
      <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-medium whitespace-nowrap">
        Lifetime (No Expiration)
      </div>
    );
  }

  return (
    <input
      type="date"
      value={expirationDate || ""}
      onChange={(e) => onExpirationChange(e.target.value)}
      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
      min={new Date().toISOString().split("T")[0]}
    />
  );
};

interface NotificationSenderProps {
  userId: string;
  userName: string;
  userEmail: string;
  onSendNotification: (
    type: NotificationType,
    message: string,
  ) => Promise<void>;
  notificationState: NotificationState;
}

const NotificationSender: React.FC<NotificationSenderProps> = ({
  userName,
  userEmail,
  onSendNotification,
  notificationState,
}) => {
  const [message, setMessage] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<NotificationType[]>([
    "inapp",
    "email",
  ]);
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || selectedTypes.length === 0) return;

    setIsSending(true);
    try {
      // Send to all selected notification types
      await Promise.all(
        selectedTypes.map((type) => onSendNotification(type, message)),
      );
      setMessage("");
    } catch (error) {
      console.error("Failed to send notifications:", error);
    } finally {
      setIsSending(false);
    }
  };

  const toggleNotificationType = (type: NotificationType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900">Send Notification</h4>
        <span className="text-xs text-gray-500">To: {userName}</span>
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={`Type your message for ${userName}...`}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        rows={3}
      />

      <div className="mt-3 flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedTypes.includes("inapp")}
            onChange={() => toggleNotificationType("inapp")}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">In-app Notification</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedTypes.includes("chat")}
            onChange={() => toggleNotificationType("chat")}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">In-app Chat</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedTypes.includes("email")}
            onChange={() => toggleNotificationType("email")}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Email ({userEmail})</span>
        </label>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          {notificationState.sentTo.length > 0 &&
            notificationState.lastSent && (
              <span>Last sent: {notificationState.lastSent}</span>
            )}
        </div>
        <button
          onClick={handleSend}
          disabled={isSending || !message.trim() || selectedTypes.length === 0}
          className="px-4 py-2 bg-[#053F53] text-white rounded-lg hover:bg-[#042a38] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          {isSending ? "Sending..." : "Send Notification"}
        </button>
      </div>
    </div>
  );
};

interface DetailsModalProps {
  rider: Rider;
  isOpen: boolean;
  onClose: () => void;
  onSendNotification: (
    type: NotificationType,
    message: string,
  ) => Promise<void>;
  notificationState: NotificationState;
}

const DetailsModal: React.FC<DetailsModalProps> = ({
  rider,
  isOpen,
  onClose,
  onSendNotification,
  notificationState,
}) => {
  if (!isOpen) return null;

  const isPlanExpired =
    rider.planExpiration && new Date(rider.planExpiration) < new Date();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {rider.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">User Details</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  User ID
                </label>
                <p className="mt-1 text-gray-900 font-medium">{rider.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email
                </label>
                <p className="mt-1 text-gray-900">{rider.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Phone
                </label>
                <p className="mt-1 text-gray-900">{rider.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Location
                </label>
                <p className="mt-1 text-gray-900">{rider.location}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Plan Expiration
                </label>
                <p className="mt-1 text-gray-900">
                  {rider.plan === "Lifetime"
                    ? "Lifetime (No expiration)"
                    : rider.planExpiration || "Not set"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Address
                </label>
                <p className="mt-1 text-gray-900">{rider.details?.address}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Vehicle
                </label>
                <p className="mt-1 text-gray-900">{rider.details?.vehicle}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Payment Method
                </label>
                <p className="mt-1 text-gray-900">
                  {rider.details?.paymentMethod}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Last Login
                </label>
                <p className="mt-1 text-gray-900">{rider.details?.lastLogin}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Average Rating
                </label>
                <p className="mt-1 text-gray-900">
                  {rider.details?.averageRating}/5
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Total Rides</div>
              <div className="text-2xl font-semibold text-gray-900 mt-1">
                {rider.rides}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Amount Spent</div>
              <div className="text-2xl font-semibold text-gray-900 mt-1">
                ${rider.spent}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Average Rating</div>
              <div className="text-2xl font-semibold text-gray-900 mt-1">
                {rider.details?.averageRating}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Joined Date</div>
              <div className="text-2xl font-semibold text-gray-900 mt-1">
                {rider.joined}
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3 flex-wrap">
            <div
              className={`px-4 py-2 rounded-lg ${
                rider.status === "Active"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              Status: {rider.status}
            </div>
            <div
              className={`px-4 py-2 rounded-lg ${
                rider.plan === "Basic"
                  ? "bg-blue-100 text-blue-800"
                  : rider.plan === "Standard"
                    ? "bg-purple-100 text-purple-800"
                    : rider.plan === "Premium"
                      ? "bg-amber-100 text-amber-800"
                      : rider.plan === "Enterprise"
                        ? "bg-indigo-100 text-indigo-800"
                        : "bg-emerald-100 text-emerald-800"
              }`}
            >
              Plan: {rider.plan}
            </div>
            <div
              className={`px-4 py-2 rounded-lg ${
                rider.subscriptionRequest === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : rider.subscriptionRequest === "Approved"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              Subscription: {rider.subscriptionRequest}
            </div>
            <div
              className={`px-4 py-2 rounded-lg ${
                rider.plan === "Lifetime"
                  ? "bg-emerald-100 text-emerald-800"
                  : isPlanExpired
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
              }`}
            >
              {rider.plan === "Lifetime"
                ? "Plan: Lifetime"
                : rider.planExpiration
                  ? isPlanExpired
                    ? `Expired: ${rider.planExpiration}`
                    : `Expires: ${rider.planExpiration}`
                  : "No expiration set"}
            </div>
          </div>

          <div className="mt-6">
            <NotificationSender
              userId={rider.id}
              userName={rider.name}
              userEmail={rider.email}
              onSendNotification={onSendNotification}
              notificationState={notificationState}
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors w-full"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getVisiblePages = (): (number | string)[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const delta = 1;
    const range: (number | string)[] = [];
    range.push(1);

    let start = Math.max(2, currentPage - delta);
    let end = Math.min(totalPages - 1, currentPage + delta);

    if (start > 2) range.push("...");
    for (let i = start; i <= end; i++) range.push(i);
    if (end < totalPages - 1) range.push("...");
    if (totalPages > 1) range.push(totalPages);

    return Array.from(new Set(range));
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-500 mr-3">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Previous
        </button>

        <div className="flex items-center gap-1">
          {visiblePages.map((page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-gray-400"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  currentPage === page
                    ? "bg-[#053F53] text-white"
                    : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
              >
                {page}
              </button>
            ),
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

// FilterDropdown Component
interface FilterDropdownProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  includeAll?: boolean;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  value,
  onChange,
  includeAll = true,
}) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer w-full"
      >
        {includeAll && <option value="">All {label}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};

// SearchInput Component
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
}) => {
  return (
    <div className="relative flex-1">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        placeholder={placeholder}
      />
    </div>
  );
};

// Filters Component
interface FiltersProps {
  filters: {
    search: string;
    plan: string;
    status: string;
    subscription: string;
    location: string;
  };
  onFilterChange: (filters: any) => void;
  availableLocations: string[];
}

const Filters: React.FC<FiltersProps> = ({
  filters,
  onFilterChange,
  availableLocations,
}) => {
  const planOptions = [
    { value: "Basic", label: "Basic" },
    { value: "Standard", label: "Standard" },
    { value: "Premium", label: "Premium" },
    { value: "Enterprise", label: "Enterprise" },
    { value: "Lifetime", label: "Lifetime" },
  ];

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Blocked", label: "Blocked" },
  ];

  const subscriptionOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
  ];

  const locationOptions = availableLocations.map((loc) => ({
    value: loc,
    label: loc,
  }));

  const clearFilters = () => {
    onFilterChange({
      search: "",
      plan: "",
      status: "",
      subscription: "",
      location: "",
    });
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className="space-y-4">
      {/* Main search row */}
      <div className="flex flex-col md:flex-row gap-4">
        <SearchInput
          value={filters.search}
          onChange={(value) => onFilterChange({ ...filters, search: value })}
          placeholder="Search by name, email, phone, or ID..."
        />

        <div className="flex gap-2">
          <button
            onClick={clearFilters}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear Filters
          </button>
          {hasActiveFilters && (
            <div className="px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-sm font-medium text-blue-700 flex items-center gap-2 whitespace-nowrap">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filters Active
            </div>
          )}
        </div>
      </div>

      {/* Filter dropdowns row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FilterDropdown
          label="Plan"
          options={planOptions}
          value={filters.plan}
          onChange={(value) => onFilterChange({ ...filters, plan: value })}
        />

        <FilterDropdown
          label="Status"
          options={statusOptions}
          value={filters.status}
          onChange={(value) => onFilterChange({ ...filters, status: value })}
        />

        <FilterDropdown
          label="Subscription"
          options={subscriptionOptions}
          value={filters.subscription}
          onChange={(value) =>
            onFilterChange({ ...filters, subscription: value })
          }
        />

        <FilterDropdown
          label="Location"
          options={locationOptions}
          value={filters.location}
          onChange={(value) => onFilterChange({ ...filters, location: value })}
        />
      </div>

      {/* Active filters chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2">
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm">
              Search: "{filters.search}"
              <button
                onClick={() => onFilterChange({ ...filters, search: "" })}
                className="ml-1 hover:text-blue-600"
              >
                ×
              </button>
            </span>
          )}
          {filters.plan && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm">
              Plan: {filters.plan}
              <button
                onClick={() => onFilterChange({ ...filters, plan: "" })}
                className="ml-1 hover:text-purple-600"
              >
                ×
              </button>
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm">
              Status: {filters.status}
              <button
                onClick={() => onFilterChange({ ...filters, status: "" })}
                className="ml-1 hover:text-green-600"
              >
                ×
              </button>
            </span>
          )}
          {filters.subscription && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              Subscription: {filters.subscription}
              <button
                onClick={() => onFilterChange({ ...filters, subscription: "" })}
                className="ml-1 hover:text-yellow-600"
              >
                ×
              </button>
            </span>
          )}
          {filters.location && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-full text-sm">
              Location: {filters.location}
              <button
                onClick={() => onFilterChange({ ...filters, location: "" })}
                className="ml-1 hover:text-indigo-600"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default function ProfessionalUsersTable() {
  const [riders, setRiders] = useState<Rider[]>(initialRiders);
  const [page, setPage] = useState(1);
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    plan: "",
    status: "",
    subscription: "",
    location: "",
  });
  const [notificationStates, setNotificationStates] = useState<
    Record<string, NotificationState>
  >({});

  // Get unique locations for filter dropdown
  const availableLocations = useMemo(() => {
    const locations = Array.from(
      new Set(initialRiders.map((rider) => rider.location)),
    );
    return locations.sort();
  }, []);

  // Filter riders based on all criteria
  const filteredRiders = useMemo(() => {
    return riders.filter((rider) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          rider.name.toLowerCase().includes(searchLower) ||
          rider.email.toLowerCase().includes(searchLower) ||
          rider.phone.toLowerCase().includes(searchLower) ||
          rider.id.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Plan filter
      if (filters.plan && rider.plan !== filters.plan) return false;

      // Status filter
      if (filters.status && rider.status !== filters.status) return false;

      // Subscription filter
      if (
        filters.subscription &&
        rider.subscriptionRequest !== filters.subscription
      )
        return false;

      // Location filter
      if (filters.location && rider.location !== filters.location) return false;

      return true;
    });
  }, [riders, filters]);

  const totalPages = Math.ceil(filteredRiders.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const currentRides = filteredRiders.slice(startIndex, startIndex + PAGE_SIZE);

  // Reset to first page when filters change
  React.useEffect(() => {
    setPage(1);
  }, [filters]);

  const updateStatus = (id: string, status: "Active" | "Blocked") => {
    setRiders((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const updateSubscription = (
    id: string,
    subscriptionRequest: "Pending" | "Approved" | "Rejected",
  ) => {
    setRiders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, subscriptionRequest } : r)),
    );
  };

  const updatePlan = (id: string, plan: PlanType) => {
    setRiders((prev) => prev.map((r) => (r.id === id ? { ...r, plan } : r)));
  };

  const updatePlanExpiration = (id: string, expirationDate: string) => {
    setRiders((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, planExpiration: expirationDate } : r,
      ),
    );
  };

  const handleSendNotification = async (
    userId: string,
    type: NotificationType,
    message: string,
  ) => {
    // In a real application, this would call an API
    console.log(`Sending ${type} notification to ${userId}: ${message}`);

    // Update notification state
    setNotificationStates((prev) => ({
      ...prev,
      [userId]: {
        isSending: false,
        sentTo: [...(prev[userId]?.sentTo || []), type],
        lastSent: new Date().toLocaleTimeString(),
      },
    }));

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return true;
  };

  const handleViewDetails = (rider: Rider) => {
    setSelectedRider(rider);
    setIsModalOpen(true);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  // Stats calculation with filters applied
  const filteredStats = useMemo(() => {
    return {
      total: filteredRiders.length,
      active: filteredRiders.filter((r) => r.status === "Active").length,
      pending: filteredRiders.filter((r) => r.subscriptionRequest === "Pending")
        .length,
      basic: filteredRiders.filter((r) => r.plan === "Basic").length,
      standard: filteredRiders.filter((r) => r.plan === "Standard").length,
      premium: filteredRiders.filter((r) => r.plan === "Premium").length,
      enterprise: filteredRiders.filter((r) => r.plan === "Enterprise").length,
      lifetime: filteredRiders.filter((r) => r.plan === "Lifetime").length,
    };
  }, [filteredRiders]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Users Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and monitor all registered Users in your system
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="px-5 py-2.5 bg-gray-100 rounded-xl border border-gray-300">
                <span className="text-sm font-medium text-gray-600">
                  Total Users:
                </span>
                <span className="ml-2 text-gray-900 font-bold text-lg">
                  {filteredStats.total}
                </span>
              </div>
              <div className="px-5 py-2.5 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-sm font-medium text-blue-600">
                  Active:
                </span>
                <span className="ml-2 text-blue-700 font-bold text-lg">
                  {filteredStats.active}
                </span>
              </div>
              <div className="px-5 py-2.5 bg-yellow-50 rounded-xl border border-yellow-200">
                <span className="text-sm font-medium text-yellow-600">
                  Pending:
                </span>
                <span className="ml-2 text-yellow-700 font-bold text-lg">
                  {filteredStats.pending}
                </span>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="mt-6">
            <Filters
              filters={filters}
              onFilterChange={handleFilterChange}
              availableLocations={availableLocations}
            />
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
              <div className="text-sm font-medium text-blue-600">
                Basic Plan
              </div>
              <div className="text-2xl font-bold text-blue-900 mt-1">
                {filteredStats.basic}
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
              <div className="text-sm font-medium text-purple-600">
                Standard Plan
              </div>
              <div className="text-2xl font-bold text-purple-900 mt-1">
                {filteredStats.standard}
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl">
              <div className="text-sm font-medium text-amber-600">
                Premium Plan
              </div>
              <div className="text-2xl font-bold text-amber-900 mt-1">
                {filteredStats.premium}
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl">
              <div className="text-sm font-medium text-indigo-600">
                Enterprise Plan
              </div>
              <div className="text-2xl font-bold text-indigo-900 mt-1">
                {filteredStats.enterprise}
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl">
              <div className="text-sm font-medium text-emerald-600">
                Lifetime Plan
              </div>
              <div className="text-2xl font-bold text-emerald-900 mt-1">
                {filteredStats.lifetime}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr className="text-left">
                <th className="p-4 pl-8 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  User ID
                </th>
                <th className="p-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="p-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="p-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Phone
                </th>
                <th className="p-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Location
                </th>
                <th className="p-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Plan
                </th>
                <th className="p-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Expiration
                </th>
                <th className="p-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Subscription
                </th>
                <th className="p-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 pr-8 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentRides.length > 0 ? (
                currentRides.map((rider) => {
                  return (
                    <tr
                      key={rider.id}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="p-4 pl-8">
                        <span className="font-mono text-sm font-medium text-gray-900">
                          {rider.id}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-[#053F53]" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {rider.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {rider.rides} rides • ${rider.spent} spent
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-700">{rider.email}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-700">{rider.phone}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span className="text-gray-700">
                            {rider.location}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <PlanSelect
                          value={rider.plan}
                          onChange={(val) => updatePlan(rider.id, val)}
                        />
                      </td>
                      <td className="p-4">
                        <PlanExpirationInput
                          plan={rider.plan}
                          expirationDate={rider.planExpiration}
                          onExpirationChange={(date) =>
                            updatePlanExpiration(rider.id, date)
                          }
                        />
                      </td>
                      <td className="p-4">
                        <SubscriptionBadge
                          value={rider.subscriptionRequest}
                          onChange={(val) => updateSubscription(rider.id, val)}
                        />
                      </td>
                      <td className="p-4">
                        <StatusBadge
                          value={rider.status}
                          onChange={(val) => updateStatus(rider.id, val)}
                        />
                      </td>
                      <td className="p-4 pr-8">
                        <button
                          onClick={() => handleViewDetails(rider)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors group-hover:bg-gray-200"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="p-8 text-center">
                    <div className="flex flex-col items-center justify-center py-12">
                      <svg
                        className="w-16 h-16 text-gray-300 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No users found
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Try adjusting your filters or search terms
                      </p>
                      <button
                        onClick={() =>
                          setFilters({
                            search: "",
                            plan: "",
                            status: "",
                            subscription: "",
                            location: "",
                          })
                        }
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">
                {filteredRiders.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0}
              </span>{" "}
              to{" "}
              <span className="font-semibold">
                {Math.min(page * PAGE_SIZE, filteredRiders.length)}
              </span>{" "}
              of <span className="font-semibold">{filteredRiders.length}</span>{" "}
              users
            </div>
            {filteredRiders.length > 0 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedRider && (
        <DetailsModal
          rider={selectedRider}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSendNotification={async (type, message) => {
            await handleSendNotification(selectedRider.id, type, message);
          }}
          notificationState={
            notificationStates[selectedRider.id] || {
              isSending: false,
              sentTo: [],
            }
          }
        />
      )}
    </div>
  );
}
