import React, { useState, useEffect } from "react";
import {
  Calendar,
  Mail,
  Phone,
  User,
  Send,
  Clock,
  ChevronDown,
  Filter,
  Bell,
  CheckCircle,
  AlertCircle,
  CalendarDays,
} from "lucide-react";

const plansData = [
  {
    id: 1,
    name: "Mak Alex",
    plan: "Gold",
    planColor: "bg-gradient-to-r from-yellow-400 to-yellow-600",
    phone: "(406) 555-0120",
    email: "markthomas321@gmail.com",
    startDate: "2026-01-01",
    endDate: "2026-01-22",
    status: "expiring",
    daysLeft: 2,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    plan: "Silver",
    planColor: "bg-gradient-to-r from-gray-300 to-gray-500",
    phone: "(406) 555-0121",
    email: "sarah.j@gmail.com",
    startDate: "2026-01-05",
    endDate: "2026-01-22",
    status: "expiring",
    daysLeft: 2,
  },
  {
    id: 3,
    name: "Robert Chen",
    plan: "Gold",
    planColor: "bg-gradient-to-r from-yellow-400 to-yellow-600",
    phone: "(406) 555-0122",
    email: "robert.chen@example.com",
    startDate: "2026-01-10",
    endDate: "2026-01-25",
    status: "expiring",
    daysLeft: 5,
  },
  {
    id: 4,
    name: "Emma Wilson",
    plan: "Platinum",
    planColor: "bg-gradient-to-r from-blue-400 to-indigo-600",
    phone: "(406) 555-0123",
    email: "emma.wilson@example.com",
    startDate: "2026-01-01",
    endDate: "2026-02-01",
    status: "active",
    daysLeft: 10,
  },
  {
    id: 5,
    name: "David Miller",
    plan: "Silver",
    planColor: "bg-gradient-to-r from-gray-300 to-gray-500",
    phone: "(406) 555-0124",
    email: "david.miller@example.com",
    startDate: "2025-12-15",
    endDate: "2026-01-15",
    status: "expired",
    daysLeft: -3,
  },
];

const PlanExtraction = () => {
  const [autoSend, setAutoSend] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [expandedDate, setExpandedDate] = useState(null);
  const [sendLogs, setSendLogs] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());

  // Group users by expiry date
  const groupedByDate = plansData.reduce((acc, item) => {
    const date = item.endDate;
    if (!acc[date]) {
      acc[date] = {
        date,
        users: [],
        count: 0,
      };
    }
    acc[date].users.push(item);
    acc[date].count++;
    return acc;
  }, {});

  const groupedDates = Object.values(groupedByDate);

  // Filter plans based on selected filter
  const getFilteredPlans = () => {
    switch (selectedFilter) {
      case "today":
        return plansData.filter((plan) => plan.daysLeft === 0);
      case "3days":
        return plansData.filter(
          (plan) => plan.daysLeft <= 3 && plan.daysLeft > 0,
        );
      case "7days":
        return plansData.filter(
          (plan) => plan.daysLeft <= 7 && plan.daysLeft > 0,
        );
      case "expired":
        return plansData.filter((plan) => plan.daysLeft < 0);
      default:
        return plansData;
    }
  };

  const filteredPlans = getFilteredPlans();

  const sendReminder = (user) => {
    const message = `Dear ${user.name},

Your ${user.plan} plan is expiring on ${user.endDate}. Renew now to continue enjoying all the premium features without interruption.

Renew here: https://example.com/renew

Best regards,
Customer Success Team`;

    console.log(`Sending reminder to: ${user.email}`);
    console.log(`Message: ${message}`);

    // Add to logs
    const newLog = {
      id: Date.now(),
      user: user.name,
      email: user.email,
      plan: user.plan,
      date: new Date().toLocaleTimeString(),
      status: "sent",
    };
    setSendLogs([newLog, ...sendLogs.slice(0, 4)]);

    return message;
  };

  const sendRemindersByDate = (date) => {
    const group = groupedByDate[date];
    if (!group) return;

    const messages = [];
    group.users.forEach((user) => {
      const message = sendReminder(user, date);
      messages.push({
        user: user.name,
        message: message,
      });
    });

    alert(`✅ Sent ${group.count} reminders for expiry date: ${date}`);
  };

  const sendReminderToSelected = () => {
    if (selectedUsers.size === 0) {
      alert("Please select users to send reminders");
      return;
    }

    let count = 0;
    plansData.forEach((user) => {
      if (selectedUsers.has(user.id)) {
        sendReminder(user);
        count++;
      }
    });

    alert(`✅ Sent ${count} reminder(s) successfully`);
    setSelectedUsers(new Set());
  };

  const sendAllReminders = () => {
    filteredPlans.forEach((user) => {
      sendReminder(user);
    });
    alert(`✅ Sent ${filteredPlans.length} reminders successfully`);
  };

  const toggleUserSelection = (userId) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const selectAllUsers = () => {
    if (selectedUsers.size === filteredPlans.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredPlans.map((user) => user.id)));
    }
  };

  const filters = [
    { id: "all", label: "All Plans", count: plansData.length },
    {
      id: "today",
      label: "Expiring Today",
      count: plansData.filter((p) => p.daysLeft === 0).length,
    },
    {
      id: "3days",
      label: "Within 3 Days",
      count: plansData.filter((p) => p.daysLeft <= 3 && p.daysLeft > 0).length,
    },
    {
      id: "7days",
      label: "Within 7 Days",
      count: plansData.filter((p) => p.daysLeft <= 7 && p.daysLeft > 0).length,
    },
    {
      id: "expired",
      label: "Expired",
      count: plansData.filter((p) => p.daysLeft < 0).length,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <CalendarDays className="w-6 h-6 text-[#053F53]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Plan Expiration Management
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Last updated: Today, 10:30 AM</span>
          </div>
        </div>
        <p className="text-gray-600 ml-12">
          Manage plan renewals and send automated reminders to customers
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Plans</p>
              <p className="text-2xl font-bold text-gray-800">
                {plansData.length}
              </p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Expiring This Week</p>
              <p className="text-2xl font-bold text-orange-600">
                {
                  plansData.filter((p) => p.daysLeft <= 7 && p.daysLeft > 0)
                    .length
                }
              </p>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Recently Sent</p>
              <p className="text-2xl font-bold text-[#053F53]">
                {sendLogs.length}
              </p>
            </div>
            <div className="p-2 bg-teal-50 rounded-lg">
              <Send className="w-6 h-6 text-[#053F53]" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Auto Send</p>
              <p className="text-2xl font-bold text-gray-800">
                {autoSend ? "Active" : "Inactive"}
              </p>
            </div>
            <div className="p-2 bg-gray-100 rounded-lg">
              <Bell className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="lg:w-2/3">
          {/* Filters */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter Plans
              </h2>
              <div className="text-sm text-gray-500">
                {selectedUsers.size > 0 && (
                  <span>{selectedUsers.size} selected</span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    selectedFilter === filter.id
                      ? "bg-[#053F53] text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-300 hover:border-teal-300"
                  }`}
                >
                  {filter.label}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      selectedFilter === filter.id
                        ? "bg-teal-700"
                        : "bg-gray-100"
                    }`}
                  >
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-4 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedUsers.size === filteredPlans.length &&
                          filteredPlans.length > 0
                        }
                        onChange={selectAllUsers}
                        className="rounded border-gray-300 text-[#053F53] focus:ring-teal-500"
                      />
                    </th>
                    <th className="p-4 text-left text-gray-700 font-semibold">
                      Customer
                    </th>
                    <th className="p-4 text-left text-gray-700 font-semibold">
                      Plan Details
                    </th>
                    <th className="p-4 text-left text-gray-700 font-semibold">
                      Dates
                    </th>
                    <th className="p-4 text-left text-gray-700 font-semibold">
                      Status
                    </th>
                    <th className="p-4 text-left text-gray-700 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlans.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.has(item.id)}
                          onChange={() => toggleUserSelection(item.id)}
                          className="rounded border-gray-300 text-[#053F53] focus:ring-teal-500"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-[#053F53]" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                {item.name}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Mail className="w-3 h-3" />
                                <span>{item.email}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold text-white ${item.planColor}`}
                          >
                            {item.plan}
                          </span>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Phone className="w-3 h-3" />
                            <span>{item.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600">
                              Start:{" "}
                              <span className="font-medium">
                                {item.startDate}
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600">
                              Expires:{" "}
                              <span className="font-medium">
                                {item.endDate}
                              </span>
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                              item.status === "expired"
                                ? "bg-red-100 text-red-700"
                                : item.status === "expiring"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-green-100 text-[#053F53]"
                            }`}
                          >
                            {item.status === "expired" && (
                              <AlertCircle className="w-3 h-3" />
                            )}
                            {item.status === "expiring" && (
                              <Clock className="w-3 h-3" />
                            )}
                            {item.status === "active" && (
                              <CheckCircle className="w-3 h-3" />
                            )}
                            {item.status === "expired"
                              ? "Expired"
                              : item.status === "expiring"
                                ? "Expiring Soon"
                                : "Active"}
                          </span>
                          {item.daysLeft >= 0 ? (
                            <span className="text-xs text-gray-500">
                              {item.daysLeft === 0
                                ? "Today"
                                : `${item.daysLeft} days left`}
                            </span>
                          ) : (
                            <span className="text-xs text-red-500">
                              Expired {Math.abs(item.daysLeft)} days ago
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => sendReminder(item)}
                          className="px-3 py-1.5 bg-teal-50 text-[#053F53] rounded-lg text-sm font-medium hover:bg-teal-100 transition-colors flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          Send
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Grouped by Date Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Reminders Grouped by Expiry Date
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Send reminders to all users with same expiry date
              </p>
            </div>
            <div className="divide-y">
              {groupedDates.map((group) => (
                <div key={group.date} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-800">
                            {group.date}
                          </span>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {group.count} {group.count === 1 ? "user" : "users"}
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            setExpandedDate(
                              expandedDate === group.date ? null : group.date,
                            )
                          }
                          className="text-sm text-[#053F53] hover:text-teal-700 flex items-center gap-1"
                        >
                          {expandedDate === group.date ? "Hide" : "Show"} users
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${expandedDate === group.date ? "rotate-180" : ""}`}
                          />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => sendRemindersByDate(group.date)}
                      className="px-4 py-2 bg-gradient-to-r from-[#053F53] to-[#0470949f] text-white rounded-lg font-medium hover:from-[#053F53] hover:to-teal-700 transition-all duration-200 flex items-center gap-2 shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                      Send to All ({group.count})
                    </button>
                  </div>

                  {expandedDate === group.date && (
                    <div className="mt-3 pl-8 border-l-2 border-teal-200">
                      {group.users.map((user) => (
                        <div
                          key={user.id}
                          className="py-2 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{user.name}</span>
                            <span className="text-sm text-gray-500">
                              {user.email}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full ${user.plan === "Gold" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}
                            >
                              {user.plan}
                            </span>
                          </div>
                          <button
                            onClick={() => sendReminder(user)}
                            className="text-sm text-[#053F53] hover:text-teal-700"
                          >
                            Send individual
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3">
          <div className="sticky top-6 space-y-6">
            {/* Actions Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Send className="w-5 h-5" />
                Send Reminders
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Auto Send</p>
                    <p className="text-sm text-gray-500">Daily at 9:00 AM</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoSend}
                      onChange={() => setAutoSend(!autoSend)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#053F53]"></div>
                  </label>
                </div>

                <button
                  onClick={sendReminderToSelected}
                  disabled={selectedUsers.size === 0}
                  className={`w-full py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    selectedUsers.size > 0
                      ? "bg-gradient-to-r from-teal-500 to-[#053F53] text-white hover:from-[#053F53] hover:to-teal-700 shadow-md"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-5 h-5" />
                  Send to Selected ({selectedUsers.size})
                </button>

                <button
                  onClick={sendAllReminders}
                  className="w-full py-3 border-2 border-[#053F53] text-[#053F53] rounded-xl font-medium hover:bg-teal-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send All Reminders
                </button>

                <div className="pt-4 border-t">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Message Preview
                  </h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        defaultValue="Your Plan Expiration Reminder"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none "
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message Body
                      </label>
                      <textarea
                        rows="6"
                        defaultValue={`Dear [Customer Name],

Your [Plan Name] plan is expiring on [Date]. Renew now to continue enjoying all the premium features without interruption.

Renew here: [Renewal Link]

Best regards,
Customer Success Team`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none "
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {sendLogs.length > 0 ? (
                  sendLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded"
                    >
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                        <Mail className="w-4 h-4 text-[#053F53]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          Reminder sent to {log.user}
                        </p>
                        <p className="text-xs text-gray-500">
                          Plan: {log.plan} • {log.date}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-[#053F53] text-xs rounded-full">
                        Sent
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <Send className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No reminders sent yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-[#053F53] to-[#0470949f] rounded-xl p-5 text-white">
              <h3 className="font-semibold mb-3">Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-teal-100">Total to send:</span>
                  <span className="font-medium">{filteredPlans.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-teal-100">Selected:</span>
                  <span className="font-medium">{selectedUsers.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-teal-100">Auto-send:</span>
                  <span className="font-medium">
                    {autoSend ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div className="pt-3 mt-3 border-t border-teal-400">
                  <p className="text-sm text-teal-100">
                    Reminders will be sent via email with renewal links and
                    instructions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanExtraction;
