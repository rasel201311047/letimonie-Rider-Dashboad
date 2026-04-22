import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  Filter,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Car,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  Banknote,
  X,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import jsPDF from "jspdf";
import {
  useGetRidesStatsQuery,
  useGetRidesQuery,
  useGetRideDetailsQuery,
} from "../../rtkquery/page/ridesApi";
import type { RideListItem } from "../../types/ridestypes";

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 5;

const statusConfig = {
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    iconColor: "text-green-500",
  },
  upcoming: {
    label: "Upcoming",
    color: "bg-yellow-100 text-yellow-800",
    icon: Calendar,
    iconColor: "text-yellow-500",
  },
  ongoing: {
    label: "Ongoing",
    color: "bg-blue-100 text-blue-800",
    icon: Clock,
    iconColor: "text-blue-500",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
    iconColor: "text-red-500",
  },
} as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
  const cfg =
    statusConfig[status as keyof typeof statusConfig] ?? statusConfig.upcoming;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium gap-1 ${cfg.color}`}
    >
      <Icon className={`w-3 h-3 ${cfg.iconColor}`} />
      {cfg.label}
    </span>
  );
};

const SkeletonRow = () => (
  <tr className="animate-pulse">
    {Array.from({ length: 6 }).map((_, i) => (
      <td key={i} className="py-4 px-6">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        {i === 0 && <div className="h-3 bg-gray-100 rounded w-1/2 mt-2" />}
      </td>
    ))}
  </tr>
);

const Avatar = ({ name, src }: { name: string; src?: string }) => {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return src ? (
    <img
      src={src}
      alt={name}
      className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200 flex-shrink-0"
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  ) : (
    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-[#053F53] ring-1 ring-blue-200 flex-shrink-0">
      {initials}
    </div>
  );
};

// ─── Details Modal ────────────────────────────────────────────────────────────

const DetailsModal = ({
  rideId,
  onClose,
}: {
  rideId: string;
  onClose: () => void;
}) => {
  const { data: ride, isLoading } = useGetRideDetailsQuery(rideId, {
    skip: !rideId,
  });

  const fmt = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Ride Details</h2>
            {ride && (
              <p className="text-sm text-gray-500 font-mono mt-0.5">
                {ride.tripId}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : ride ? (
            <div className="space-y-6">
              {/* Status + Basic Info */}
              <div className="flex items-center gap-3">
                <StatusBadge status={ride.tripStatus} />
                <span className="text-sm text-gray-500">
                  {ride.totalDistance}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {ride.revenue}
                </span>
              </div>

              {/* Route */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#053F53] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Pickup</p>
                    <p className="text-sm font-medium text-gray-900">
                      {ride.pickUpAddress}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Drop-off</p>
                    <p className="text-sm font-medium text-gray-900">
                      {ride.dropOffAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-gray-900">
                    {ride.price} JOD
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Price/Seat</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-gray-900">
                    {ride.totalSeatBooked}/{ride.totalSeats}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Seats Booked</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-gray-900">
                    {ride.totalDistance}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Distance</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Departure</p>
                  <p className="text-sm text-gray-900 mt-0.5">
                    {fmt(ride.departureDateTime)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Started At</p>
                  <p className="text-sm text-gray-900 mt-0.5">
                    {fmt(ride.startedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Completed At</p>
                  <p className="text-sm text-gray-900 mt-0.5">
                    {fmt(ride.completedAt)}
                  </p>
                </div>
              </div>

              {/* Driver */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Driver
                </h3>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Avatar
                    name={ride.driver.fullName}
                    src={ride.driver.avatar}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">
                      {ride.driver.fullName}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="flex items-center gap-0.5 text-xs text-amber-600">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {ride.driver.avgRating > 0
                          ? ride.driver.avgRating.toFixed(1)
                          : "N/A"}
                      </span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-500">
                        {ride.driver.totalTripCompleted} trips
                      </span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-500">
                        {ride.driver.totalEarning} JOD earned
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passengers */}
              {ride.passengers?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Passengers ({ride.passengers.length})
                  </h3>
                  <div className="space-y-2">
                    {ride.passengers.map((p) => (
                      <div
                        key={p.bookingId}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                      >
                        <Avatar name={p.name} src={p.avatar} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm">
                            {p.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-xs text-gray-500">
                              {p.seatsBooked} seat(s)
                            </span>
                            <span className="text-xs text-gray-400">·</span>
                            <span className="text-xs text-gray-500">
                              {p.amountPaid} JOD paid
                            </span>
                            <span className="text-xs text-gray-400">·</span>
                            <StatusBadge status={p.status} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              Failed to load ride details.
            </p>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
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

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const pages: (number | "...")[] = [];

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
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={`dots-${idx}`} className="px-2 text-gray-400 text-sm">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
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
        className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

// ─── Export Utilities ─────────────────────────────────────────────────────────

const generateCSV = (rides: RideListItem[]) => {
  const headers = [
    "Trip ID",
    "Ride ID",
    "Status",
    "Driver",
    "Driver Rating",
    "Pickup",
    "Drop-off",
    "Seats Booked",
    "Total Seats",
    "Revenue",
    "Duration",
    "Created At",
  ];
  const rows = rides.map((r) =>
    [
      r.tripId,
      r.rideId,
      r.tripStatus,
      `"${r.driverName}"`,
      r.driverRating,
      `"${r.pickUpAddress}"`,
      `"${r.dropOffAddress}"`,
      r.totalSeatBooked,
      r.totalSeats,
      r.revenue,
      r.duration,
      r.createdAt,
    ].join(","),
  );
  const blob = new Blob([[headers.join(","), ...rows].join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `rides-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const generatePDF = (rides: RideListItem[]) => {
  const pdf = new jsPDF("landscape", "mm", "a4");
  pdf.setFontSize(20);
  pdf.setTextColor(40, 40, 40);
  pdf.text("Rides Report", 20, 20);
  pdf.setFontSize(11);
  pdf.setTextColor(100, 100, 100);
  pdf.text(
    `Generated: ${new Date().toLocaleDateString()} · Total: ${rides.length}`,
    20,
    30,
  );

  const headers = [
    "Trip ID",
    "Driver",
    "Pickup",
    "Drop-off",
    "Status",
    "Revenue",
    "Duration",
  ];
  const colWidths = [35, 35, 50, 50, 28, 28, 22];
  let y = 48;

  pdf.setFillColor(245, 247, 250);
  pdf.rect(20, y - 5, 248, 8, "F");
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 0, 0);
  let x = 20;
  headers.forEach((h, i) => {
    pdf.text(h, x + 1, y);
    x += colWidths[i];
  });
  y += 8;

  pdf.setFont("helvetica", "normal");
  rides.forEach((r, idx) => {
    if (y > 190) {
      pdf.addPage();
      y = 20;
    }
    const row = [
      r.tripId,
      r.driverName,
      r.pickUpAddress.slice(0, 28),
      r.dropOffAddress.slice(0, 28),
      r.tripStatus,
      r.revenue,
      r.duration,
    ];
    x = 20;
    row.forEach((cell, ci) => {
      pdf.text(String(cell), x + 1, y);
      x += colWidths[ci];
    });
    y += 6;
    if (idx < rides.length - 1) {
      pdf.setDrawColor(220, 220, 220);
      pdf.line(20, y - 1, 268, y - 1);
    }
  });

  pdf.save(`rides-report-${new Date().toISOString().split("T")[0]}.pdf`);
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RidesPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);
  const [exportType, setExportType] = useState<"current" | "all">("current");
  const [showExportOptions, setShowExportOptions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  // Debounce search
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

  // Close export dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setShowExportOptions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── RTK Query ──
  const { data: stats, isLoading: statsLoading } = useGetRidesStatsQuery();

  const {
    data: ridesData,
    isLoading,
    isFetching,
    isError,
  } = useGetRidesQuery(
    { page, limit: PAGE_SIZE, searchTerm: debouncedSearch || undefined },
    { refetchOnMountOrArgChange: true },
  );

  // Fetch all rides for export (no search, high limit)
  const { data: allRidesData } = useGetRidesQuery(
    { page: 1, limit: 1000 },
    { skip: exportType !== "all" || !showExportOptions },
  );

  const rides = ridesData?.data ?? [];
  const meta = ridesData?.meta;

  // Client-side status filter (applied on top of search results)
  const filteredRides =
    selectedStatus === "all"
      ? rides
      : rides.filter((r) => r.tripStatus === selectedStatus);

  const showSkeleton = isLoading || isFetching;

  const handleExport = useCallback(
    (type: "pdf" | "csv") => {
      const exportData =
        exportType === "all" ? (allRidesData?.data ?? rides) : filteredRides;
      if (type === "pdf") generatePDF(exportData);
      else generateCSV(exportData);
      setShowExportOptions(false);
    },
    [exportType, allRidesData, rides, filteredRides],
  );

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Rides Management</h1>
          <p className="text-gray-600 mt-1 text-sm">
            Monitor and manage all rides in the system
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-8">
          {[
            {
              label: "Total Rides",
              value: stats?.totalRides ?? 0,
              icon: Car,
              bg: "bg-blue-50",
              iconColor: "text-[#053F53]",
              note: "All time rides",
              noteColor: "text-gray-500",
            },
            {
              label: "Upcoming Rides",
              value: stats?.upcomingRides ?? 0,
              icon: Calendar,
              bg: "bg-yellow-50",
              iconColor: "text-yellow-600",
              note: "Scheduled ahead",
              noteColor: "text-gray-500",
            },
            {
              label: "Ongoing Rides",
              value: stats?.ongoingRides ?? 0,
              icon: Clock,
              bg: "bg-pink-50",
              iconColor: "text-pink-600",
              note: "Currently active",
              noteColor: "text-gray-500",
            },
            {
              label: "Completed Rides",
              value: stats?.completedRides ?? 0,
              icon: CheckCircle,
              bg: "bg-green-50",
              iconColor: "text-green-600",
              note: "Successfully done",
              noteColor: "text-green-600",
            },
            {
              label: "Revenue Today",
              value: statsLoading
                ? "—"
                : (stats?.revenueToday?.amount ?? "0.00 JOD"),
              icon: Banknote,
              bg: "bg-purple-50",
              iconColor: "text-purple-600",
              note: statsLoading
                ? ""
                : `Growth: ${stats?.revenueToday?.growth ?? "0%"}`,
              noteColor: "text-purple-600",
            },
          ].map(
            ({ label, value, icon: Icon, bg, iconColor, note, noteColor }) => (
              <div
                key={label}
                className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {statsLoading ? (
                        <span className="inline-block h-7 w-16 bg-gray-100 rounded animate-pulse" />
                      ) : (
                        value
                      )}
                    </p>
                  </div>
                  <div className={`${bg} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                  </div>
                </div>
                <p className={`text-xs mt-2 ${noteColor}`}>{note}</p>
              </div>
            ),
          )}
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Controls */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search */}
              <div className="flex-1 relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by Trip ID, Driver..."
                  className="w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#053F53]/30 focus:border-[#053F53] text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#053F53]/30 focus:border-[#053F53] outline-none cursor-pointer"
                    value={selectedStatus}
                    onChange={(e) => {
                      setSelectedStatus(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Export */}
                <div className="relative" ref={exportRef}>
                  <button
                    onClick={() => setShowExportOptions((v) => !v)}
                    className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  {showExportOptions && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-20">
                      <div className="p-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Export Options
                        </p>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input
                              type="radio"
                              checked={exportType === "current"}
                              onChange={() => setExportType("current")}
                            />
                            Current view ({filteredRides.length} rides)
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input
                              type="radio"
                              checked={exportType === "all"}
                              onChange={() => setExportType("all")}
                            />
                            All rides ({meta?.total ?? "..."})
                          </label>
                        </div>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => handleExport("pdf")}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                          <FileText className="w-4 h-4 text-red-500" />
                          Download as PDF
                        </button>
                        <button
                          onClick={() => handleExport("csv")}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                          <FileText className="w-4 h-4 text-green-500" />
                          Download as CSV
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {isError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
                <XCircle className="w-4 h-4 flex-shrink-0" />
                Failed to load rides. Please check your connection.
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {[
                    "Trip ID",
                    "Driver",
                    "Route",
                    "Seats",
                    "Ride Fare",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="py-3.5 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {showSkeleton ? (
                  Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                ) : filteredRides.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Car className="w-12 h-12 text-gray-200" />
                        <p className="text-base font-medium text-gray-700">
                          No rides found
                        </p>
                        <p className="text-sm text-gray-400">
                          {debouncedSearch
                            ? `No results for "${debouncedSearch}"`
                            : "No rides available"}
                        </p>
                        {debouncedSearch && (
                          <button
                            onClick={() => setSearchTerm("")}
                            className="mt-1 px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-900"
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRides.map((ride) => (
                    <tr
                      key={ride.rideId}
                      className="hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      {/* Trip ID */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <p className="font-mono text-sm font-medium text-gray-900">
                          {ride.tripId}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatDate(ride.createdAt)}
                        </p>
                      </td>

                      {/* Driver */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <Avatar
                            name={ride.driverName}
                            src={ride.driverAvatar}
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {ride.driverName}
                            </p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              <span className="text-xs text-gray-500">
                                {ride.driverRating === "N/A"
                                  ? "N/A"
                                  : ride.driverRating}
                              </span>
                              <span className="text-xs text-gray-400">
                                · {ride.driverTotalReviews} reviews
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Route */}
                      <td className="py-4 px-6">
                        <div className="space-y-1.5 min-w-[200px]">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#053F53] flex-shrink-0" />
                            <span className="text-xs text-gray-700 truncate max-w-[180px]">
                              {ride.pickUpAddress}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                            <span className="text-xs text-gray-700 truncate max-w-[180px]">
                              {ride.dropOffAddress}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Seats */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {ride.totalSeatBooked}/{ride.totalSeats}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {ride.duration}
                        </p>
                      </td>

                      {/* Revenue */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                          <span className="text-sm font-semibold text-gray-900">
                            {ride.revenue}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <StatusBadge status={ride.tripStatus} />
                      </td>

                      <td className="p-4 pr-8">
                        <button
                          // onClick={() => {
                          //   setSelectedPassenger(p);
                          //   setIsModalOpen(true);
                          // }}
                          onClick={() => setSelectedRideId(ride.rideId)}
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

          {/* Footer / Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                  of <span className="font-semibold">{meta.total}</span> rides
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
      {selectedRideId && (
        <DetailsModal
          rideId={selectedRideId}
          onClose={() => setSelectedRideId(null)}
        />
      )}
    </div>
  );
}
