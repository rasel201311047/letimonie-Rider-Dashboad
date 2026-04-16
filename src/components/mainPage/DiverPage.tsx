import React, { useState, useCallback, useEffect } from "react";
import {
  Check,
  X,
  Search,
  Filter,
  Shield,
  UserCheck,
  UserX,
  AlertCircle,
  ChevronDown,
  Car,
  FileText,
  Loader2,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { toDriverStatus, type DriverListItem } from "../../types/divertype";
import {
  useGetDriversQuery,
  useGetDriverStatsQuery,
  useGetDriverDetailsQuery,
  useChangeDriverStatusMutation,
} from "../../rtkquery/page/driverApi";

// ─── Constants ───────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

type FilterType = "all" | "active" | "blocked" | "pending";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay = 500): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface StatusBadgeProps {
  isActive: boolean | null;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ isActive }) => {
  const status = toDriverStatus(isActive);

  const styleMap = {
    Active: "bg-green-100 text-green-800 border border-green-300",
    Blocked: "bg-red-100 text-red-800 border border-red-300",
    Pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${styleMap[status]}`}
    >
      {status}
    </span>
  );
};

interface VerificationBadgeProps {
  isActive: boolean | null;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({ isActive }) => {
  if (isActive === true)
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-300">
        Verified
      </span>
    );
  if (isActive === false)
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800 border border-rose-300">
        Rejected
      </span>
    );
  return (
    <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300">
      Unverified
    </span>
  );
};

// ─── Pagination ──────────────────────────────────────────────────────────────

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
  const getVisiblePages = (): (number | "...")[] => {
    if (totalPages <= 6)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    const range: (number | "...")[] = [1];
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) range.push("...");
    for (let i = start; i <= end; i++) range.push(i);
    if (end < totalPages - 1) range.push("...");
    if (totalPages > 1) range.push(totalPages);

    return range;
  };

  return (
    <div className="flex items-center justify-end gap-2 mt-6 text-sm">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-4 py-2 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-200"
      >
        ← Previous
      </button>

      <div className="flex items-center gap-1">
        {getVisiblePages().map((page, idx) =>
          page === "..." ? (
            <span key={`e-${idx}`} className="px-3 py-2 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                currentPage === page
                  ? "bg-[#053F53] text-white shadow-sm"
                  : "hover:bg-gray-100 text-gray-700 border border-gray-200"
              }`}
            >
              {page}
            </button>
          ),
        )}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages || totalPages === 0}
        className="flex items-center gap-1 px-4 py-2 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-200"
      >
        Next →
      </button>
    </div>
  );
};

// ─── Driver Document Modal ───────────────────────────────────────────────────

interface DriverDocumentModalProps {
  open: boolean;
  driver: DriverListItem | null;
  onClose: () => void;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
  isChanging: boolean;
}

const DriverDocumentModal: React.FC<DriverDocumentModalProps> = ({
  open,
  driver,
  onClose,
  onApprove,
  onReject,
  isChanging,
}) => {
  const { data: detailsData, isLoading: detailsLoading } =
    useGetDriverDetailsQuery(driver?.driverId ?? "", {
      skip: !open || !driver,
    });

  if (!open || !driver) return null;

  const details = detailsData?.data;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white w-[90%] max-w-5xl h-[90%] max-h-[900px] rounded-2xl shadow-2xl p-6 relative flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Driver Documents — {driver.fullName}
            </h2>
            <div className="flex items-center gap-4 mt-2">
              <StatusBadge isActive={driver.isActive} />
              <VerificationBadge isActive={driver.isActive} />
              <span className="text-sm text-gray-500">
                Joined: {new Date(driver.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={24} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Action Banner */}
        {driver.isActive === null && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-blue-600" size={20} />
                <span className="font-medium text-blue-800">
                  Action Required: Review this driver's documents
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  disabled={isChanging}
                  onClick={() => onApprove(driver.userId)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-60"
                >
                  {isChanging ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <UserCheck size={18} />
                  )}
                  Approve Driver
                </button>
                <button
                  disabled={isChanging}
                  onClick={() => onReject(driver.userId)}
                  className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-60"
                >
                  {isChanging ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <UserX size={18} />
                  )}
                  Reject Driver
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-8">
          {detailsLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
              <Loader2 size={40} className="animate-spin" />
              <p>Loading driver documents…</p>
            </div>
          ) : !details ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
              <FileText size={40} />
              <p>No document details available.</p>
            </div>
          ) : (
            <>
              {/* Vehicle Info */}
              <section className="bg-gray-50 rounded-xl p-5 border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Car size={20} className="text-[#053F53]" /> Vehicle
                  Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  {[
                    { label: "Car Model", value: details.carModel },
                    { label: "License Plate", value: details.licensePlate },
                    { label: "Vehicle Type", value: details.vehicleType },
                    { label: "License Number", value: details.licenseNumber },
                    { label: "Governorate", value: details.governorate },
                    {
                      label: "Languages",
                      value: details.languages.join(", "),
                    },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                        {label}
                      </p>
                      <p className="font-medium text-gray-800">{value}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Verification Image (KYC) */}
              {details.verificationImage && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Verification Document (KYC)
                    </h3>
                    <button
                      onClick={() =>
                        window.open(details.verificationImage, "_blank")
                      }
                      className="flex items-center gap-1 text-sm text-[#053F53] hover:underline"
                    >
                      <ExternalLink size={14} /> Open full size
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border">
                    <img
                      src={details.verificationImage}
                      alt="Verification document"
                      className="w-full h-80 object-contain rounded-lg hover:scale-105 transition-transform duration-200 cursor-zoom-in"
                      onClick={() =>
                        window.open(details.verificationImage, "_blank")
                      }
                    />
                  </div>
                </section>
              )}

              {/* Car Images */}
              {details.carImages.length > 0 && (
                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Vehicle Photos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {details.carImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 rounded-xl p-4 border"
                      >
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Photo {idx + 1}
                        </p>
                        <img
                          src={img}
                          alt={`Car photo ${idx + 1}`}
                          className="w-full h-72 object-contain rounded-lg hover:scale-105 transition-transform duration-200 cursor-zoom-in"
                          onClick={() => window.open(img, "_blank")}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DriverPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<DriverListItem | null>(
    null,
  );
  const [openModal, setOpenModal] = useState(false);

  // Debounce search so we don't spam the API on every keystroke
  const debouncedSearch = useDebounce(searchInput, 500);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // ── API Calls ──────────────────────────────────────────────────────────────

  const {
    data: driversData,
    isLoading: driversLoading,
    isFetching: driversFetching,
    isError: driversError,
    refetch: refetchDrivers,
  } = useGetDriversQuery({
    page,
    limit: PAGE_SIZE,
    searchTerm: debouncedSearch,
  });

  const { data: statsData, isLoading: statsLoading } = useGetDriverStatsQuery();

  const [changeStatus, { isLoading: isChanging }] =
    useChangeDriverStatusMutation();

  // ── Derived data ───────────────────────────────────────────────────────────

  const allDrivers = driversData?.data ?? [];
  const meta = driversData?.meta;
  const stats = statsData?.data;

  /** Client-side filter on top of server-side search */
  const filteredDrivers = allDrivers.filter((d) => {
    if (filter === "all") return true;
    if (filter === "active") return d.isActive === true;
    if (filter === "blocked") return d.isActive === false;
    if (filter === "pending") return d.isActive === null;
    return true;
  });

  const totalPages = meta?.totalPages ?? 1;

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleApprove = useCallback(
    async (userId: string) => {
      const playload = {
        status: true,
      };
      await changeStatus({ userId, status: playload });
      setOpenModal(false);
    },
    [changeStatus],
  );

  const handleReject = useCallback(
    async (userId: string) => {
      const playload = {
        status: false,
      };
      await changeStatus({ userId, status: playload });
      setOpenModal(false);
    },
    [changeStatus],
  );

  /**
   * Toggle Active ↔ Blocked.
   * Pending drivers can only be changed from the modal (Approve / Reject).
   * Active/Blocked drivers cannot be reverted to Pending.
   */
  const handleToggleStatus = useCallback(
    async (driver: DriverListItem) => {
      if (driver.isActive === null) return;
      const newStatus = !driver.isActive;
      console.log("=====================================================");
      console.log("Sending:", { userId: driver.userId, status: newStatus }); // 👈 add this

      const playload = {
        status: newStatus,
      };
      console.log(playload);
      const res = await changeStatus({
        userId: driver.userId,
        status: playload,
      });
      console.log(res);
    },
    [changeStatus],
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 space-y-6">
      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Drivers",
            value: stats?.totalDrivers,
            icon: <Shield className="text-blue-600" size={24} />,
            bg: "bg-blue-100",
          },
          {
            label: "Active Accounts",
            value: stats?.activeAccounts,
            icon: <UserCheck className="text-green-600" size={24} />,
            bg: "bg-green-100",
          },
          {
            label: "Online Drivers",
            value: stats?.onlineDrivers,
            icon: <AlertCircle className="text-yellow-600" size={24} />,
            bg: "bg-yellow-100",
          },
          {
            label: "Inactive Accounts",
            value: stats?.inactiveAccounts,
            icon: <UserX className="text-red-600" size={24} />,
            bg: "bg-red-100",
          },
        ].map(({ label, value, icon, bg }) => (
          <div
            key={label}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-800">
                  {statsLoading ? (
                    <Loader2 size={20} className="animate-spin mt-1" />
                  ) : (
                    (value ?? 0)
                  )}
                </p>
              </div>
              <div className={`p-3 ${bg} rounded-lg`}>{icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Table ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Driver Management
              </h2>
              {meta && (
                <p className="text-sm text-gray-500 mt-1">
                  Showing {filteredDrivers.length} of {meta.total} drivers
                  {debouncedSearch && ` for "${debouncedSearch}"`}
                </p>
              )}
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search drivers…"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#053F53]/30 focus:border-[#053F53]"
                />
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters((v) => !v)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter size={16} />
                  {filter === "all"
                    ? "All Drivers"
                    : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
                  />
                </button>

                {showFilters && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="p-2">
                      {(
                        [
                          { value: "all", label: "All Drivers" },
                          { value: "active", label: "Active Only" },
                          { value: "blocked", label: "Blocked Only" },
                          { value: "pending", label: "Pending Review" },
                        ] as { value: FilterType; label: string }[]
                      ).map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setFilter(opt.value);
                            setShowFilters(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                            filter === opt.value
                              ? "bg-[#053F53]/10 text-[#053F53] font-medium"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Refresh */}
              <button
                onClick={() => refetchDrivers()}
                disabled={driversFetching}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw
                  size={18}
                  className={driversFetching ? "animate-spin" : ""}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-600 font-medium">
                <th className="p-4 pl-6">Driver</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Trips</th>
                <th className="p-4">Earning</th>
                <th className="p-4">Online</th>
                <th className="p-4">Status</th>
                <th className="p-4">Verification</th>
                <th className="p-4 pr-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {driversLoading ? (
                <tr>
                  <td colSpan={9} className="py-20 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 size={36} className="animate-spin" />
                      <p>Loading drivers…</p>
                    </div>
                  </td>
                </tr>
              ) : driversError ? (
                <tr>
                  <td colSpan={9} className="py-20 text-center text-red-400">
                    <div className="flex flex-col items-center gap-3">
                      <X size={36} />
                      <p>Failed to load drivers. Please try again.</p>
                      <button
                        onClick={() => refetchDrivers()}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredDrivers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-20 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-3">
                      <Search size={36} />
                      <p>No drivers found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDrivers.map((driver) => {
                  const status = toDriverStatus(driver.isActive);
                  const isPending = driver.isActive === null;

                  return (
                    <tr
                      key={driver.driverId}
                      className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      {/* Driver */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={driver.avatar}
                            alt={driver.fullName}
                            className="w-9 h-9 rounded-full object-cover border border-gray-200 bg-gray-100"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg";
                            }}
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {driver.fullName}
                            </p>
                            <p className="text-xs text-gray-400">
                              {driver.accountId}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="p-4">
                        <p className="text-gray-900">{driver.email}</p>
                        <p className="text-xs text-gray-500">{driver.phone}</p>
                      </td>

                      {/* Rating */}
                      <td className="p-4 font-medium text-gray-900">
                        {driver.avgRating > 0
                          ? `${driver.avgRating.toFixed(1)} ⭐`
                          : "—"}
                      </td>

                      {/* Trips */}
                      <td className="p-4">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                          {driver.totalTripCompleted} trips
                        </span>
                      </td>

                      {/* Earning */}
                      <td className="p-4 font-medium text-gray-900">
                        ${driver.totalEarning.toFixed(2)}
                      </td>

                      {/* Online */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium ${
                            driver.isOnline ? "text-green-600" : "text-gray-400"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              driver.isOnline ? "bg-green-500" : "bg-gray-300"
                            }`}
                          />
                          {driver.isOnline ? "Online" : "Offline"}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="p-4">
                        <StatusBadge isActive={driver.isActive} />
                      </td>

                      {/* Verification Badge */}
                      <td className="p-4">
                        <VerificationBadge isActive={driver.isActive} />
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-6">
                        <div className="flex items-center gap-2">
                          {/* View Documents */}
                          <button
                            onClick={() => {
                              setSelectedDriver(driver);
                              setOpenModal(true);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Documents"
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M4 8V4M4 4H8M4 4L9 9M20 8V4M20 4H16M20 4L15 9M4 16V20M4 20H8M4 20L9 15M20 20L15 15M20 20V16M20 20H16"
                                stroke="#4B5563"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>

                          {/* Pending → Approve / Reject */}
                          {isPending && (
                            <>
                              <button
                                disabled={isChanging}
                                onClick={() => handleApprove(driver.userId)}
                                className="p-2 hover:bg-green-100 rounded-lg transition-colors text-green-600 disabled:opacity-50"
                                title="Approve Driver"
                              >
                                {isChanging ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <Check size={16} />
                                )}
                              </button>
                              <button
                                disabled={isChanging}
                                onClick={() => handleReject(driver.userId)}
                                className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600 disabled:opacity-50"
                                title="Reject Driver"
                              >
                                {isChanging ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <X size={16} />
                                )}
                              </button>
                            </>
                          )}

                          {/* Active ↔ Blocked toggle */}
                          {!isPending && (
                            <button
                              disabled={isChanging}
                              onClick={() => handleToggleStatus(driver)}
                              className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                                status === "Active"
                                  ? "hover:bg-red-100 text-red-600"
                                  : "hover:bg-green-100 text-green-600"
                              }`}
                              title={
                                status === "Active"
                                  ? "Block Driver"
                                  : "Activate Driver"
                              }
                            >
                              {isChanging ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : status === "Active" ? (
                                <UserX size={16} />
                              ) : (
                                <UserCheck size={16} />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Document Modal */}
      <DriverDocumentModal
        open={openModal}
        driver={selectedDriver}
        onClose={() => setOpenModal(false)}
        onApprove={handleApprove}
        onReject={handleReject}
        isChanging={isChanging}
      />
    </div>
  );
}
