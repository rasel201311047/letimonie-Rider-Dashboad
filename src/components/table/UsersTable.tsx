import React, { useState, useEffect, useCallback, useRef } from "react";
import type { Passenger } from "../../types/passengertype";
import {
  useChangePassengerStatusMutation,
  useGetPassengersQuery,
  useGetPassengerStatsQuery,
} from "../../rtkquery/page/passengersApi";
// import {
//   useGetPassengersQuery,
//   useGetPassengerStatsQuery,
//   useChangePassengerStatusMutation,
// } from "./passengersApi";
// import type { Passenger } from "./passengerTypes";

const PAGE_SIZE = 10;

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusBadge: React.FC<{
  isActive: boolean;
  isLoading: boolean;
  onClick: () => void;
}> = ({ isActive, isLoading, onClick }) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
      isActive
        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
        : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
    }`}
  >
    {isLoading ? "..." : isActive ? "Active" : "Blocked"}
  </button>
);

const OnlineBadge: React.FC<{ isOnline: boolean }> = ({ isOnline }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
      isOnline
        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
        : "bg-gray-100 text-gray-500 border border-gray-200"
    }`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-emerald-500" : "bg-gray-400"}`}
    />
    {isOnline ? "Online" : "Offline"}
  </span>
);

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-1">
    <svg
      className="w-3.5 h-3.5 text-amber-400 fill-current"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
    <span className="text-sm text-gray-700">{rating.toFixed(1)}</span>
  </div>
);

const Avatar: React.FC<{ name: string; avatar?: string }> = ({
  name,
  avatar,
}) => {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return avatar ? (
    <img
      src={avatar}
      alt={name}
      className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200"
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  ) : (
    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-[#053F53] ring-1 ring-blue-200">
      {initials}
    </div>
  );
};

const SkeletonRow: React.FC = () => (
  <tr className="animate-pulse">
    {Array.from({ length: 9 }).map((_, i) => (
      <td key={i} className="p-4">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
      </td>
    ))}
  </tr>
);

// ─── Details Modal ────────────────────────────────────────────────────────────

const DetailsModal: React.FC<{
  passenger: Passenger | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleStatus: () => Promise<void>;
  togglingStatus: boolean;
}> = ({ passenger, isOpen, onClose, onToggleStatus, togglingStatus }) => {
  if (!isOpen || !passenger) return null;

  const joined = new Date(passenger.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar name={passenger.fullName} avatar={passenger.avatar} />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {passenger.fullName}
              </h2>
              <p className="text-sm text-gray-500 font-mono">
                {passenger.userId}
              </p>
            </div>
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

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900">
                {passenger.totalRides}
              </div>
              <div className="text-xs text-gray-500 mt-1">Total Rides</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900">
                {passenger.totalReviews}
              </div>
              <div className="text-xs text-gray-500 mt-1">Reviews</div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-amber-700">
                {passenger.avgRating.toFixed(1)}
              </div>
              <div className="text-xs text-amber-600 mt-1">Avg Rating</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <p className="text-xs text-gray-500 font-medium">Email</p>
              <p className="text-sm text-gray-900 mt-0.5">{passenger.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Phone</p>
              <p className="text-sm text-gray-900 mt-0.5">{passenger.phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Account ID</p>
              <p className="text-sm text-gray-900 mt-0.5 font-mono text-xs">
                {passenger.accountId || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Joined</p>
              <p className="text-sm text-gray-900 mt-0.5">{joined}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Online Status</p>
              <div className="mt-1">
                <OnlineBadge isOnline={passenger.isOnline} />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">
                Account Status
              </p>
              <div className="mt-1">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${passenger.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {passenger.isActive ? "Active" : "Blocked"}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={async () => {
              await onToggleStatus();
              onClose();
            }}
            disabled={togglingStatus}
            className={`w-full py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-60 ${
              passenger.isActive
                ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                : "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
            }`}
          >
            {togglingStatus
              ? "Updating..."
              : passenger.isActive
                ? "Block Passenger"
                : "Activate Passenger"}
          </button>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Pagination ───────────────────────────────────────────────────────────────

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  const pages: (number | string)[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    )
      pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
          Prev
        </button>
        <div className="flex items-center gap-1">
          {pages.map((p, i) =>
            p === "..." ? (
              <span key={`e-${i}`} className="px-2 py-1 text-gray-400 text-sm">
                ...
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p as number)}
                className={`w-9 h-9 rounded-lg text-sm transition-colors ${
                  currentPage === p
                    ? "bg-[#053F53] text-white"
                    : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
              >
                {p}
              </button>
            ),
          )}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PassengersTable() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search — auto-resets page to 1 on new search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchTerm]);

  // ── RTK Query ──
  const {
    data: passengersData,
    isLoading,
    isFetching,
    isError,
  } = useGetPassengersQuery(
    { page, limit: PAGE_SIZE, searchTerm: debouncedSearch },
    { refetchOnMountOrArgChange: true },
  );

  const { data: stats, isLoading: statsLoading } = useGetPassengerStatsQuery();

  const [changeStatus, { isLoading: isChangingStatus }] =
    useChangePassengerStatusMutation();

  const passengers = passengersData?.data ?? [];
  const meta = passengersData?.meta;
  console.log("============================================");
  console.log(passengers);

  const handleToggleStatus = useCallback(
    async (userId: string, currentStatus: boolean) => {
      // currentStatus যোগ
      try {
        await changeStatus({
          userId,
          status: !currentStatus, // ← toggle করুন
        }).unwrap();
      } catch (e) {
        console.error("Failed to update passenger status:", e);
      }
    },
    [changeStatus],
  );

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const showSkeleton = isLoading || isFetching;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Passengers Management
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                Manage and monitor all registered passengers
              </p>
            </div>

            {/* Live stats from /admin/passengers/stats */}
            <div className="flex flex-wrap gap-3">
              {(
                [
                  {
                    label: "Total",
                    key: "totalPassengers" as const,
                    cls: "bg-gray-100 border-gray-300",
                    txt: "text-gray-900",
                    sub: "text-gray-600",
                  },
                  {
                    label: "Online",
                    key: "onlinePassengers" as const,
                    cls: "bg-emerald-50 border-emerald-200",
                    txt: "text-emerald-700",
                    sub: "text-emerald-600",
                  },
                  {
                    label: "Active",
                    key: "activeAccounts" as const,
                    cls: "bg-blue-50 border-blue-200",
                    txt: "text-blue-700",
                    sub: "text-blue-600",
                  },
                  {
                    label: "Inactive",
                    key: "inactiveAccounts" as const,
                    cls: "bg-red-50 border-red-200",
                    txt: "text-red-700",
                    sub: "text-red-600",
                  },
                ] as const
              ).map(({ label, key, cls, txt, sub }) => (
                <div
                  key={label}
                  className={`px-5 py-2.5 rounded-xl border ${cls}`}
                >
                  <span className={`text-sm font-medium ${sub}`}>{label}:</span>
                  <span className={`ml-2 font-bold text-lg ${txt}`}>
                    {statsLoading ? "—" : (stats?.[key] ?? "—")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="mt-6 relative max-w-md">
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053F53]/30 focus:border-[#053F53] text-sm"
              placeholder="Search by name, email, or phone..."
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
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
              </button>
            )}
          </div>

          {isError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Failed to load passengers. Please check your connection.
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr className="text-left">
                {[
                  "Passenger",
                  "Email",
                  "Phone",
                  "Rides",
                  "Avg Rating",
                  "Joined",
                  "Online",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="p-4 first:pl-8 last:pr-8 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {showSkeleton ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : passengers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-16 text-center">
                    <div className="flex flex-col items-center">
                      <svg
                        className="w-14 h-14 text-gray-200 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <h3 className="text-base font-medium text-gray-800">
                        No passengers found
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {debouncedSearch
                          ? `No results for "${debouncedSearch}"`
                          : "No passengers registered yet"}
                      </p>
                      {debouncedSearch && (
                        <button
                          onClick={() => setSearchTerm("")}
                          className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-sm"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                passengers.map((p) => (
                  <tr
                    key={p.userId}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="p-4 pl-8">
                      <div className="flex items-center gap-3">
                        <Avatar name={p.fullName} avatar={p.avatar} />
                        <div>
                          <div className="font-medium text-gray-900 text-sm">
                            {p.fullName}
                          </div>
                          <div className="text-xs text-gray-400 font-mono">
                            {p.userId.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-700">{p.email}</td>
                    <td className="p-4 text-sm text-gray-700 whitespace-nowrap">
                      {p.phone}
                    </td>
                    <td className="p-4 text-sm text-gray-700">
                      {p.totalRides}
                    </td>
                    <td className="p-4">
                      <StarRating rating={p.avgRating} />
                    </td>
                    <td className="p-4 text-sm text-gray-700 whitespace-nowrap">
                      {formatDate(p.createdAt)}
                    </td>
                    <td className="p-4">
                      <OnlineBadge isOnline={p.isOnline} />
                    </td>
                    <td className="p-4">
                      <StatusBadge
                        isActive={p.isActive}
                        isLoading={isChangingStatus}
                        onClick={() => handleToggleStatus(p.userId, p.isActive)}
                      />
                    </td>
                    <td className="p-4 pr-8">
                      <button
                        onClick={() => {
                          setSelectedPassenger(p);
                          setIsModalOpen(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="text-sm text-gray-600">
              {showSkeleton ? (
                <span className="text-gray-400">Loading...</span>
              ) : meta ? (
                <>
                  Showing{" "}
                  <span className="font-semibold">
                    {meta.total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}
                  </span>{" "}
                  –{" "}
                  <span className="font-semibold">
                    {Math.min(page * PAGE_SIZE, meta.total)}
                  </span>{" "}
                  of <span className="font-semibold">{meta.total}</span>{" "}
                  passengers
                  {debouncedSearch && (
                    <span className="text-gray-400">
                      {" "}
                      · filtered by "{debouncedSearch}"
                    </span>
                  )}
                </>
              ) : null}
            </div>
            {meta && meta.totalPages > 1 && !showSkeleton && (
              <Pagination
                currentPage={page}
                totalPages={meta.totalPages}
                onPageChange={setPage}
              />
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <DetailsModal
        passenger={selectedPassenger}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onToggleStatus={async () => {
          if (selectedPassenger)
            await handleToggleStatus(
              selectedPassenger.userId,
              selectedPassenger.isActive,
            );
        }}
        togglingStatus={isChangingStatus}
      />
    </div>
  );
}
