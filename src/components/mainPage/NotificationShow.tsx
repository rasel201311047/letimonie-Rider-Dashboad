import React from "react";
import {
  Bell,
  Car,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

// Mock notification data
const notifications = [
  {
    id: 1,
    title: "New Driver Request",
    message: "John Doe has requested to become a driver with Premium Plan",
    type: "driver_request",
    plan: "Premium",
    timestamp: "10 min ago",
    read: false,
    status: "pending",
  },
  {
    id: 2,
    title: "Plan Purchase",
    message: "Sarah Smith purchased the Basic Driver Plan",
    type: "plan_purchase",
    plan: "Basic",
    timestamp: "1 hour ago",
    read: false,
    status: "completed",
  },
  {
    id: 3,
    title: "Plan Upgrade",
    message: "Michael Brown upgraded to Business Plan",
    type: "plan_upgrade",
    plan: "Business",
    timestamp: "2 hours ago",
    read: true,
    status: "completed",
  },
  {
    id: 4,
    title: "Payment Failed",
    message: "Driver registration payment failed for Robert Wilson",
    type: "payment_failed",
    plan: "Premium",
    timestamp: "1 day ago",
    read: true,
    status: "failed",
  },
];

const NotificationCard = ({ notification }) => {
  const getIcon = () => {
    switch (notification.type) {
      case "driver_request":
        return <Car className="w-5 h-5" />;
      case "plan_purchase":
        return <CheckCircle className="w-5 h-5" />;
      case "plan_upgrade":
        return <Bell className="w-5 h-5" />;
      case "payment_failed":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getStatusIcon = () => {
    switch (notification.status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getPlanBadgeColor = () => {
    switch (notification.plan) {
      case "Basic":
        return "bg-gray-100 text-gray-800";
      case "Premium":
        return "bg-blue-100 text-blue-800";
      case "Business":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className={`flex items-start p-4 border-b ${notification.read ? "bg-white" : "bg-blue-50"}`}
    >
      <div className="flex-shrink-0 mr-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center`}
          style={{ backgroundColor: "#053F53", color: "white" }}
        >
          {getIcon()}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4
            className={`text-sm font-medium ${notification.read ? "text-gray-700" : "text-gray-900"}`}
          >
            {notification.title}
          </h4>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">
              {notification.timestamp}
            </span>
            {getStatusIcon()}
          </div>
        </div>

        <p className="mt-1 text-sm text-gray-600">{notification.message}</p>

        <div className="mt-2 flex items-center space-x-3">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getPlanBadgeColor()}`}
          >
            {notification.plan} Plan
          </span>

          {notification.type === "driver_request" && (
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 text-xs font-medium rounded-md text-white"
                style={{ backgroundColor: "#053F53" }}
              >
                Approve
              </button>
              <button className="px-3 py-1 text-xs font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200">
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function NotificationShow() {
  const [notificationsList, setNotificationsList] =
    React.useState(notifications);
  const unreadCount = notificationsList.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotificationsList((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    );
  };

  const clearAll = () => {
    setNotificationsList([]);
  };

  const filterByType = (type) => {
    if (type === "all") {
      setNotificationsList(notifications);
    } else {
      setNotificationsList(notifications.filter((n) => n.type === type));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
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

            <div className="flex items-center space-x-4">
              {unreadCount > 0 && (
                <span className="px-3 py-1 text-sm font-medium rounded-full text-white bg-red-500">
                  {unreadCount} unread
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div
                className="p-2 rounded-lg mr-3"
                style={{ backgroundColor: "#053F53", color: "white" }}
              >
                <Car className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Driver Requests</p>
                <p className="text-xl font-bold" style={{ color: "#053F53" }}>
                  {
                    notificationsList.filter((n) => n.type === "driver_request")
                      .length
                  }
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
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Plan Purchases</p>
                <p className="text-xl font-bold" style={{ color: "#053F53" }}>
                  {
                    notificationsList.filter((n) => n.type === "plan_purchase")
                      .length
                  }
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
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Plan Upgrades</p>
                <p className="text-xl font-bold" style={{ color: "#053F53" }}>
                  {
                    notificationsList.filter((n) => n.type === "plan_upgrade")
                      .length
                  }
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
                <p className="text-sm text-gray-600">Failed Payments</p>
                <p className="text-xl font-bold" style={{ color: "#053F53" }}>
                  {
                    notificationsList.filter((n) => n.type === "payment_failed")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow mb-4">
          <div className="p-4 border-b">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex space-x-2 mb-2 md:mb-0">
                <button
                  onClick={() => filterByType("all")}
                  className="px-4 py-2 text-sm font-medium rounded-md text-white"
                  style={{ backgroundColor: "#053F53" }}
                >
                  All
                </button>
                <button
                  onClick={() => filterByType("driver_request")}
                  className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
                >
                  Driver Requests
                </button>
                <button
                  onClick={() => filterByType("plan_purchase")}
                  className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
                >
                  Plan Purchases
                </button>
                <button
                  onClick={() => filterByType("payment_failed")}
                  className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
                >
                  Failed Payments
                </button>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Mark all as read
                </button>
                <button
                  onClick={clearAll}
                  className="px-4 py-2 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                >
                  Clear all
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div>
            {notificationsList.length > 0 ? (
              notificationsList.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                />
              ))
            ) : (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No notifications
                </h3>
                <p className="text-gray-500">
                  All caught up! No new notifications.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium mb-3" style={{ color: "#053F53" }}>
            Status Legend
          </h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-yellow-500 mr-2" />
              <span className="text-sm text-gray-600">Pending Approval</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-sm text-gray-600">Completed</span>
            </div>
            <div className="flex items-center">
              <XCircle className="w-4 h-4 text-red-500 mr-2" />
              <span className="text-sm text-gray-600">Failed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
