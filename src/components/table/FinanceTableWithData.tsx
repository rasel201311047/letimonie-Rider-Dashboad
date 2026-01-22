import React, { useState, useEffect } from "react";

interface PaymentRecord {
  id: string;
  transactionId: string;
  userId: string;
  userName: string;
  email: string;
  subscriptionPlan: string;
  price: number;
  paymentDate: string;
  paymentTime: string;
  paymentMethod: string;
  paymentStatus: string;
  billingCycle: string;
  nextBillingDate?: string;
}

const samplePayments = [
  {
    id: "001",
    transactionId: "TXN-789456",
    userId: "USR-001",
    userName: "John Smith",
    email: "john@example.com",
    subscriptionPlan: "Premium",
    price: 29.99,
    paymentDate: "2024-01-15",
    paymentTime: "14:30",
    paymentMethod: "Cash",
    paymentStatus: "Completed",
    billingCycle: "Monthly",
    nextBillingDate: "2024-02-15",
  },
  {
    id: "002",
    transactionId: "TXN-789457",
    userId: "USR-002",
    userName: "Sarah Johnson",
    email: "sarah@example.com",
    subscriptionPlan: "Pro",
    price: 99.99,
    paymentDate: "2024-01-14",
    paymentTime: "10:15",
    paymentMethod: "Cash",
    paymentStatus: "Pending",
    billingCycle: "Yearly",
    nextBillingDate: "2025-01-14",
  },
  {
    id: "003",
    transactionId: "TXN-789458",
    userId: "USR-003",
    userName: "Mike Chen",
    email: "mike@example.com",
    subscriptionPlan: "Business",
    price: 199.99,
    paymentDate: "2024-01-13",
    paymentTime: "16:45",
    paymentMethod: "Cash",
    paymentStatus: "Completed",
    billingCycle: "Quarterly",
    nextBillingDate: "2024-04-13",
  },
  {
    id: "004",
    transactionId: "TXN-789459",
    userId: "USR-004",
    userName: "Emma Wilson",
    email: "emma@example.com",
    subscriptionPlan: "Basic",
    price: 9.99,
    paymentDate: "2024-01-12",
    paymentTime: "09:30",
    paymentMethod: "Cash",
    paymentStatus: "Failed",
    billingCycle: "Monthly",
  },
  {
    id: "005",
    transactionId: "TXN-789460",
    userId: "USR-005",
    userName: "Alex Rodriguez",
    email: "alex@example.com",
    subscriptionPlan: "Enterprise",
    price: 499.99,
    paymentDate: "2024-01-11",
    paymentTime: "11:20",
    paymentMethod: "Cash",
    paymentStatus: "Refunded",
    billingCycle: "One-time",
  },
  {
    id: "006",
    transactionId: "TXN-789461",
    userId: "USR-006",
    userName: "David Miller",
    email: "david@example.com",
    subscriptionPlan: "Premium",
    price: 29.99,
    paymentDate: "2024-01-10",
    paymentTime: "13:45",
    paymentMethod: "Cash",
    paymentStatus: "Completed",
    billingCycle: "Monthly",
    nextBillingDate: "2024-02-10",
  },
  {
    id: "007",
    transactionId: "TXN-789462",
    userId: "USR-007",
    userName: "Lisa Anderson",
    email: "lisa@example.com",
    subscriptionPlan: "Pro",
    price: 99.99,
    paymentDate: "2024-01-09",
    paymentTime: "15:20",
    paymentMethod: "Cash",
    paymentStatus: "Completed",
    billingCycle: "Yearly",
    nextBillingDate: "2025-01-09",
  },
  {
    id: "008",
    transactionId: "TXN-789463",
    userId: "USR-008",
    userName: "Robert Brown",
    email: "robert@example.com",
    subscriptionPlan: "Basic",
    price: 9.99,
    paymentDate: "2024-01-08",
    paymentTime: "11:10",
    paymentMethod: "Cash",
    paymentStatus: "Pending",
    billingCycle: "Monthly",
    nextBillingDate: "2024-02-08",
  },
  {
    id: "009",
    transactionId: "TXN-789464",
    userId: "USR-009",
    userName: "Maria Garcia",
    email: "maria@example.com",
    subscriptionPlan: "Business",
    price: 199.99,
    paymentDate: "2024-01-07",
    paymentTime: "14:55",
    paymentMethod: "Cash",
    paymentStatus: "Completed",
    billingCycle: "Quarterly",
    nextBillingDate: "2024-04-07",
  },
  {
    id: "010",
    transactionId: "TXN-789465",
    userId: "USR-010",
    userName: "James Wilson",
    email: "james@example.com",
    subscriptionPlan: "Enterprise",
    price: 499.99,
    paymentDate: "2024-01-06",
    paymentTime: "09:45",
    paymentMethod: "Cash",
    paymentStatus: "Completed",
    billingCycle: "One-time",
  },
  {
    id: "011",
    transactionId: "TXN-789466",
    userId: "USR-011",
    userName: "Sophia Lee",
    email: "sophia@example.com",
    subscriptionPlan: "Premium",
    price: 29.99,
    paymentDate: "2024-01-05",
    paymentTime: "16:30",
    paymentMethod: "Cash",
    paymentStatus: "Refunded",
    billingCycle: "Monthly",
  },
  {
    id: "012",
    transactionId: "TXN-789467",
    userId: "USR-012",
    userName: "William Taylor",
    email: "william@example.com",
    subscriptionPlan: "Pro",
    price: 99.99,
    paymentDate: "2024-01-04",
    paymentTime: "10:25",
    paymentMethod: "Cash",
    paymentStatus: "Completed",
    billingCycle: "Yearly",
    nextBillingDate: "2025-01-04",
  },
  // Adding more data with different months for filtering
  {
    id: "013",
    transactionId: "TXN-789468",
    userId: "USR-013",
    userName: "Olivia Martinez",
    email: "olivia@example.com",
    subscriptionPlan: "Premium",
    price: 29.99,
    paymentDate: "2023-12-15",
    paymentTime: "14:30",
    paymentMethod: "Cash",
    paymentStatus: "Completed",
    billingCycle: "Monthly",
    nextBillingDate: "2024-01-15",
  },
  {
    id: "014",
    transactionId: "TXN-789469",
    userId: "USR-014",
    userName: "Daniel Thompson",
    email: "daniel@example.com",
    subscriptionPlan: "Pro",
    price: 99.99,
    paymentDate: "2023-11-20",
    paymentTime: "11:15",
    paymentMethod: "Cash",
    paymentStatus: "Completed",
    billingCycle: "Yearly",
    nextBillingDate: "2024-11-20",
  },
  {
    id: "015",
    transactionId: "TXN-789470",
    userId: "USR-015",
    userName: "Sophia Williams",
    email: "sophia.w@example.com",
    subscriptionPlan: "Business",
    price: 199.99,
    paymentDate: "2023-10-05",
    paymentTime: "09:45",
    paymentMethod: "Cash",
    paymentStatus: "Completed",
    billingCycle: "Quarterly",
    nextBillingDate: "2024-01-05",
  },
];

interface FinanceTableProps {
  payments: PaymentRecord[];
}

const FinanceTable: React.FC<FinanceTableProps> = ({ payments }) => {
  const [filteredPayments, setFilteredPayments] =
    useState<PaymentRecord[]>(payments);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [planFilter, setPlanFilter] = useState<string>("All");
  const [dateFilter, setDateFilter] = useState<string>("All"); // "Today", "This Week", "This Month", "This Year", "Custom"
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof PaymentRecord;
    direction: "asc" | "desc";
  } | null>(null);

  // Get unique values for filters
  const statusOptions = [
    "All",
    ...Array.from(new Set(payments.map((p) => p.paymentStatus))),
  ];
  const planOptions = [
    "All",
    ...Array.from(new Set(payments.map((p) => p.subscriptionPlan))),
  ];
  const dateOptions = [
    "All",
    "Today",
    "Yesterday",
    "This Week",
    "Last Week",
    "This Month",
    "Last Month",
    "This Year",
    "Last Year",
    "Custom Range",
  ];
  const pageSizes = [5, 10, 15, 20];

  // Helper function to check if date is within a range
  const isDateInRange = (
    dateString: string,
    startDate: Date,
    endDate: Date,
  ) => {
    const date = new Date(dateString);
    return date >= startDate && date <= endDate;
  };

  // Get date range based on filter selection
  const getDateRange = (filter: string) => {
    const today = new Date();
    const start = new Date();
    const end = new Date();

    switch (filter) {
      case "Today":
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        return { start, end };

      case "Yesterday":
        start.setDate(today.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        end.setDate(today.getDate() - 1);
        end.setHours(23, 59, 59, 999);
        return { start, end };

      case "This Week":
        start.setDate(today.getDate() - today.getDay());
        start.setHours(0, 0, 0, 0);
        end.setDate(today.getDate() + (6 - today.getDay()));
        end.setHours(23, 59, 59, 999);
        return { start, end };

      case "Last Week":
        start.setDate(today.getDate() - today.getDay() - 7);
        start.setHours(0, 0, 0, 0);
        end.setDate(today.getDate() - today.getDay() - 1);
        end.setHours(23, 59, 59, 999);
        return { start, end };

      case "This Month":
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(today.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        return { start, end };

      case "Last Month":
        start.setMonth(today.getMonth() - 1, 1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(today.getMonth(), 0);
        end.setHours(23, 59, 59, 999);
        return { start, end };

      case "This Year":
        start.setMonth(0, 1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(11, 31);
        end.setHours(23, 59, 59, 999);
        return { start, end };

      case "Last Year":
        start.setFullYear(today.getFullYear() - 1, 0, 1);
        start.setHours(0, 0, 0, 0);
        end.setFullYear(today.getFullYear() - 1, 11, 31);
        end.setHours(23, 59, 59, 999);
        return { start, end };

      case "Custom Range":
        if (customStartDate && customEndDate) {
          return {
            start: new Date(customStartDate),
            end: new Date(customEndDate),
          };
        }
        return null;

      default:
        return null;
    }
  };

  // Apply filters and search
  useEffect(() => {
    let result = payments;

    // Filter by status
    if (statusFilter !== "All") {
      result = result.filter(
        (payment) => payment.paymentStatus === statusFilter,
      );
    }

    // Filter by plan
    if (planFilter !== "All") {
      result = result.filter(
        (payment) => payment.subscriptionPlan === planFilter,
      );
    }

    // Filter by date range
    if (dateFilter !== "All") {
      const dateRange = getDateRange(dateFilter);
      if (dateRange) {
        result = result.filter((payment) =>
          isDateInRange(payment.paymentDate, dateRange.start, dateRange.end),
        );
      }
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (payment) =>
          payment.userName.toLowerCase().includes(term) ||
          payment.email.toLowerCase().includes(term) ||
          payment.transactionId.toLowerCase().includes(term) ||
          payment.userId.toLowerCase().includes(term),
      );
    }

    // Apply sorting
    if (sortConfig !== null) {
      result = [...result].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredPayments(result);
    setCurrentPage(1);
  }, [
    searchTerm,
    statusFilter,
    planFilter,
    dateFilter,
    customStartDate,
    customEndDate,
    payments,
    sortConfig,
  ]);

  // Handle sorting
  const handleSort = (key: keyof PaymentRecord) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Get sort icon
  const getSortIcon = (key: keyof PaymentRecord) => {
    if (!sortConfig || sortConfig.key !== key) return "↕️";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = filteredPayments.slice(startIndex, endIndex);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "Failed":
        return "bg-red-100 text-red-800 border border-red-200";
      case "Refunded":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "Premium":
        return "bg-blue-100 text-blue-800";
      case "Pro":
        return "bg-purple-100 text-purple-800";
      case "Business":
        return "bg-green-100 text-green-800";
      case "Enterprise":
        return "bg-yellow-100 text-yellow-800";
      case "Basic":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "Cash":
        return (
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
            <span className="text-green-600 font-bold text-xs">$</span>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
            <span className="text-gray-600 font-bold text-xs">$</span>
          </div>
        );
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Get summary for current filter
  const getFilterSummary = () => {
    const dateRange = getDateRange(dateFilter);
    if (dateRange) {
      const start = dateRange.start.toLocaleDateString();
      const end = dateRange.end.toLocaleDateString();
      return `${start} - ${end}`;
    }
    return "All time";
  };

  // Pagination controls
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </div>

        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(endIndex, filteredPayments.length)}
              </span>{" "}
              of <span className="font-medium">{filteredPayments.length}</span>{" "}
              results
            </p>
          </div>

          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                  currentPage === 1
                    ? "cursor-not-allowed bg-gray-50"
                    : "hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                }`}
              >
                <span className="sr-only">Previous</span>
                &larr;
              </button>

              {startPage > 1 && (
                <>
                  <button
                    onClick={() => goToPage(1)}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    1
                  </button>
                  {startPage > 2 && (
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                      ...
                    </span>
                  )}
                </>
              )}

              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    currentPage === page
                      ? "z-10 bg-[#053D51] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  }`}
                >
                  {page}
                </button>
              ))}

              {endPage < totalPages && (
                <>
                  {endPage < totalPages - 1 && (
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                      ...
                    </span>
                  )}
                  <button
                    onClick={() => goToPage(totalPages)}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                  currentPage === totalPages
                    ? "cursor-not-allowed bg-gray-50"
                    : "hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                }`}
              >
                <span className="sr-only">Next</span>
                &rarr;
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header with Controls */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Cash Payment History
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              View and manage all cash payment transactions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {filteredPayments.length} transactions
            </span>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name, email, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg sm:text-sm"
              />
            </div>
          </div>

          {/* Date Filter */}
          <div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg  sm:text-sm"
            >
              {dateOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 sm:text-sm"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  Status: {status}
                </option>
              ))}
            </select>
          </div>

          {/* Plan Filter */}
          <div>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg  sm:text-sm"
            >
              {planOptions.map((plan) => (
                <option key={plan} value={plan}>
                  Plan: {plan}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Custom Date Range Inputs */}
        {dateFilter === "Custom Range" && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2  sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2sm:text-sm"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setCustomStartDate("");
                  setCustomEndDate("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none "
              >
                Clear Dates
              </button>
            </div>
          </div>
        )}

        {/* Items per page selector */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm  "
            >
              {pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-600 ml-4">
              Period:{" "}
              <span className="font-semibold">{getFilterSummary()}</span>
            </span>
          </div>

          <div className="text-sm text-gray-600">
            Filtered Cash Amount:{" "}
            <span className="font-semibold text-green-600">
              {formatCurrency(
                filteredPayments.reduce((sum, p) => sum + p.price, 0),
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {[
                { key: "transactionId", label: "Transaction ID" },
                { key: "userName", label: "User" },
                { key: "subscriptionPlan", label: "Subscription Plan" },
                { key: "price", label: "Amount" },
                { key: "paymentDate", label: "Payment Date & Time" },
                { key: "paymentMethod", label: "Payment Method" },
                { key: "billingCycle", label: "Billing Cycle" },
                { key: "paymentStatus", label: "Status" },
              ].map((column) => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column.key as keyof PaymentRecord)}
                  className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    <span className="text-xs opacity-50">
                      {getSortIcon(column.key as keyof PaymentRecord)}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentPayments.length > 0 ? (
              currentPayments.map((payment, index) => (
                <tr
                  key={`${payment.id}-${index}`}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="text-gray-900 text-sm font-medium">
                        {payment.transactionId}
                      </span>
                      <span className="text-gray-500 text-xs mt-1">
                        #{payment.id}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="text-gray-900 text-sm font-medium">
                        {payment.userName}
                      </span>
                      <span className="text-gray-500 text-xs mt-1">
                        {payment.email}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getPlanColor(
                        payment.subscriptionPlan,
                      )}`}
                    >
                      {payment.subscriptionPlan}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-900 text-sm font-semibold">
                      {formatCurrency(payment.price)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="text-gray-900 text-sm">
                        {payment.paymentDate}
                      </span>
                      <span className="text-gray-500 text-xs mt-1">
                        {payment.paymentTime}
                      </span>
                      {payment.nextBillingDate && (
                        <span className="text-[#053D51] text-xs mt-1">
                          Renews: {payment.nextBillingDate}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      {getPaymentMethodIcon(payment.paymentMethod)}
                      <span className="text-gray-900 text-sm">
                        {payment.paymentMethod}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-900 text-sm">
                      {payment.billingCycle}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center w-24 justify-center py-1.5 rounded-full text-xs font-semibold ${getStatusColor(
                        payment.paymentStatus,
                      )}`}
                    >
                      {payment.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-400 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-gray-500 font-medium">
                      No cash payments found
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Try adjusting your filters or search term
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredPayments.length > 0 && renderPagination()}

      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            {statusOptions.slice(1).map((status) => {
              const count = filteredPayments.filter(
                (p) => p.paymentStatus === status,
              ).length;
              if (count === 0) return null;

              const color =
                status === "Completed"
                  ? "bg-green-500"
                  : status === "Pending"
                    ? "bg-yellow-500"
                    : status === "Failed"
                      ? "bg-red-500"
                      : "bg-purple-500";

              return (
                <div key={status} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${color} mr-2`}></div>
                  <span className="text-sm text-gray-700">
                    {status}: <span className="font-semibold">{count}</span>
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-right">
            <span className="text-sm text-gray-700">
              Cash Revenue ({getFilterSummary()}):{" "}
            </span>
            <span className="text-lg font-semibold text-green-600">
              {formatCurrency(
                filteredPayments.reduce((sum, p) => sum + p.price, 0),
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const FinanceTableWithData: React.FC = () => {
  const cashPayments = samplePayments.filter(
    (payment) => payment.paymentMethod === "Cash",
  );

  return (
    <div className="min-h-screen  p-4 md:p-6">
      <div className="w-full mx-auto">
        <FinanceTable payments={cashPayments} />
      </div>
    </div>
  );
};

export default FinanceTableWithData;
