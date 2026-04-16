import React, { useState } from "react";
import {
  Bell,
  Car,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import type { Notification } from "../../types/notificationtype";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useGetUnseenCountQuery,
} from "../../rtkquery/page/notificationApi";

interface NotificationCardProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  isMarking: boolean;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkRead,
  isMarking,
}) => {
  // Derive type from message text for icon selection
  const getIcon = () => {
    const msg = notification.message.toLowerCase();
    if (msg.includes("subscription") || msg.includes("purchase"))
      return <Car className="w-5 h-5" />;
    if (msg.includes("upgrade")) return <Bell className="w-5 h-5" />;
    if (msg.includes("fail") || msg.includes("error"))
      return <AlertCircle className="w-5 h-5" />;
    return <CheckCircle className="w-5 h-5" />;
  };

  // Derive plan badge from message
  const getPlan = (): string => {
    const msg = notification.message.toLowerCase();
    if (msg.includes("premium-plus")) return "Premium Plus";
    if (msg.includes("premium")) return "Premium";
    if (msg.includes("business")) return "Business";
    if (msg.includes("basic")) return "Basic";
    return "Standard";
  };

  const getPlanBadgeColor = () => {
    const plan = getPlan();
    switch (plan) {
      case "Basic":
        return "bg-gray-100 text-gray-800";
      case "Premium":
        return "bg-blue-100 text-blue-800";
      case "Premium Plus":
        return "bg-indigo-100 text-indigo-800";
      case "Business":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className={`flex items-start p-4 border-b transition-colors duration-200 ${
        notification.isRead ? "bg-white" : "bg-blue-50"
      }`}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mr-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#053F53", color: "white" }}
        >
          {getIcon()}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4
            className={`text-sm font-medium ${
              notification.isRead ? "text-gray-700" : "text-gray-900"
            }`}
          >
            {notification.title}
          </h4>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">
              {notification.timeAgo}
            </span>
            {notification.isRead ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <Clock className="w-4 h-4 text-yellow-500" />
            )}
          </div>
        </div>

        <p className="mt-1 text-sm text-gray-600">{notification.message}</p>

        <div className="mt-2 flex items-center space-x-3">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getPlanBadgeColor()}`}
          >
            {getPlan()} Plan
          </span>

          {!notification.isRead && (
            <button
              onClick={() => onMarkRead(notification._id)}
              disabled={isMarking}
              className="px-3 py-1 text-xs font-medium rounded-md text-white flex items-center gap-1 disabled:opacity-60"
              style={{ backgroundColor: "#053F53" }}
            >
              {isMarking ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <CheckCircle className="w-3 h-3" />
              )}
              Mark as Read
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function NotificationShow() {
  const [page, setPage] = useState(1);
  const limit = 10;

  // Queries
  const {
    data: notificationsData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetNotificationsQuery({ page, limit });

  const { data: unseenData } = useGetUnseenCountQuery();

  // Mutation
  const [markAsRead, { isLoading: isMarking }] = useMarkAsReadMutation();

  const notifications: Notification[] = notificationsData?.data ?? [];
  const meta = notificationsData?.meta;
  const unseenCount = unseenData?.data?.unseenCount ?? 0;

  // Count helpers
  const subscriptionCount = notifications.filter((n) =>
    n.message.toLowerCase().includes("subscription"),
  ).length;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkRead = async (id: string) => {
    try {
      await markAsRead(id).unwrap();
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* ── Header ── */}
        <div className="mb-6" style={{ color: "#053F53" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: "#053F53" }}
              >
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Driver Notifications</h1>
                <p className="text-gray-600">
                  Manage driver requests and plan purchases
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {unseenCount > 0 && (
                <span className="px-3 py-1 text-sm font-medium rounded-full text-white bg-red-500">
                  {unseenCount} unseen
                </span>
              )}
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div
                className="p-2 rounded-lg mr-3"
                style={{ backgroundColor: "#053F53", color: "white" }}
              >
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Notifications</p>
                <p className="text-xl font-bold" style={{ color: "#053F53" }}>
                  {meta?.total ?? 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div
                className="p-2 rounded-lg mr-3"
                style={{ backgroundColor: "#053F53", color: "white" }}
              >
                <Car className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Subscription Requests</p>
                <p className="text-xl font-bold" style={{ color: "#053F53" }}>
                  {subscriptionCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div
                className="p-2 rounded-lg mr-3"
                style={{ backgroundColor: "#053F53", color: "white" }}
              >
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Unread (This Page)</p>
                <p className="text-xl font-bold" style={{ color: "#053F53" }}>
                  {unreadCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Notifications List ── */}
        <div className="bg-white rounded-lg shadow mb-4">
          {/* List header */}
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">
              {meta
                ? `Showing ${notifications.length} of ${meta.total} notifications`
                : "Notifications"}
            </h2>
            {isFetching && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Updating...
              </span>
            )}
          </div>

          {/* States */}
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mb-3" />
              <p className="text-sm">Loading notifications...</p>
            </div>
          ) : isError ? (
            <div className="p-12 flex flex-col items-center justify-center text-red-400">
              <XCircle className="w-10 h-10 mb-3" />
              <p className="text-sm font-medium">
                Failed to load notifications
              </p>
              <button
                onClick={() => refetch()}
                className="mt-3 px-4 py-2 text-sm rounded-md text-white"
                style={{ backgroundColor: "#053F53" }}
              >
                Try Again
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No notifications
              </h3>
              <p className="text-gray-500">
                All caught up! No new notifications.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationCard
                key={notification._id}
                notification={notification}
                onMarkRead={handleMarkRead}
                isMarking={isMarking}
              />
            ))
          )}
        </div>

        {/* ── Pagination ── */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mb-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isFetching}
              className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {meta.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages || isFetching}
              className="px-4 py-2 text-sm rounded-md text-white disabled:opacity-50"
              style={{ backgroundColor: "#053F53" }}
            >
              Next
            </button>
          </div>
        )}

        {/* ── Legend ── */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium mb-3" style={{ color: "#053F53" }}>
            Status Legend
          </h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-yellow-500 mr-2" />
              <span className="text-sm text-gray-600">Unread</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-sm text-gray-600">Read</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
