import React, { useState, useEffect, useCallback, useRef } from "react";
import type { Passenger } from "../../types/passengertype";
import {
  useChangePassengerStatusMutation,
  useGetPassengersQuery,
  useGetPassengerStatsQuery,
  usePostSubscriptionMutation,
} from "../../rtkquery/page/passengersApi";
import { useSendNotificationMutation } from "../../rtkquery/page/notificationApi";
import toast from "react-hot-toast";

// ── Types ─────────────────────────────────────────────────────────────────────
type PlanName = "free" | "premium" | "premium-plus" | "all-access";
type PeriodLabel = "" | "monthly" | "yearly" | "Lifetime";
type ModalType = "plan" | "period" | null;

interface Period {
  label: PeriodLabel;
  months: number | null;
}

interface ModalState {
  type: ModalType;
  passengerId: string;
  plan: PlanName;
  period: Period;
  startStr: string;
  endStr: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const PLANS: PlanName[] = ["free", "premium", "premium-plus", "all-access"];

const PERIODS: Period[] = [
  { label: "monthly", months: 1 },
  { label: "yearly", months: 12 },
  { label: "Lifetime", months: null },
];

const PLAN_COLOR: Record<string, string> = {
  free: "rgb(156, 163, 175)",
  premium: "#34d399",
  "premium-plus": "#60a5fa",
  "all-access": "#f472b6",
};

const PLAN_PRICE: Record<string, { monthly: string; yearly: string }> = {
  free: { monthly: "—", yearly: "—" },
  premium: { monthly: "4 JOD", yearly: "40 JOD" },
  "premium-plus": { monthly: "7 JOD", yearly: "70 JOD" },
  "all-access": { monthly: "6 JOD", yearly: "60 JOD" },
};

// Numeric price values for the API body
const PLAN_PRICE_NUM: Record<string, { monthly: number; yearly: number }> = {
  free: { monthly: 0, yearly: 0 },
  premium: { monthly: 4, yearly: 40 },
  "premium-plus": { monthly: 7, yearly: 70 },
  "all-access": { monthly: 6, yearly: 60 },
};

function toInputStr(date: Date): string {
  return date.toISOString().split("T")[0];
}

function calcEndDate(startDate: Date, months: number): Date {
  const d = new Date(startDate);
  d.setMonth(d.getMonth() + months);
  d.setDate(d.getDate() - 1);
  return d;
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

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
    {Array.from({ length: 12 }).map((_, i) => (
      <td key={i} className="p-4">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
      </td>
    ))}
  </tr>
);

// ─── Plan Badge (inline in table) ─────────────────────────────────────────────
const PlanBadge: React.FC<{ plan: string }> = ({ plan }) => {
  const color = PLAN_COLOR[plan] ?? "#9ca3af";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize"
      style={{
        background: color + "18",
        border: `1px solid ${color}55`,
        color: color,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: color }}
      />
      {plan}
    </span>
  );
};

// ─── Details Modal ────────────────────────────────────────────────────────────
const DetailsModal: React.FC<{
  passenger: Passenger | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleStatus: () => Promise<void>;
  togglingStatus: boolean;
}> = ({ passenger, isOpen, onClose, onToggleStatus, togglingStatus }) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sendNotification, { isLoading: isSending }] =
    useSendNotificationMutation();

  if (!isOpen || !passenger) return null;

  const joined = new Date(passenger.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const handleSubmit = async () => {
    const payload = {
      audience: "specific-user" as const,
      title,
      message,
      receiver: passenger.userId,
    };
    const toastId = toast.loading("Sending notification…");
    // console.log("Notification submitted:", { title, message });
    // console.log("For passenger:", payload);

    try {
      const res = await sendNotification(payload).unwrap();
      toast.success(res.message || "Notification sent successfully!", {
        id: toastId,
      });
      // console.log("Notification API response:", res);
      // Reset form
      setTitle("");
      setMessage("");
    } catch (err: unknown) {
      const errorMessage =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to send notification.";
      toast.error(errorMessage, { id: toastId });
    }
  };

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
                {passenger.accountId || ""}
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
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    passenger.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {passenger.isActive ? "Active" : "Blocked"}
                </span>
              </div>
            </div>
          </div>

          {/* Notification */}
          <div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
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

            <div>
              <label className="block text-sm font-medium text-gray-500 my-2">
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
              <button
                onClick={handleSubmit}
                className="w-full py-2.5 mt-3 rounded-lg font-medium text-sm transition-colors bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
              >
                {isSending ? "Sending..." : "Send Notification"}
              </button>
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
  const [modal, setModal] = useState<ModalState | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // ── Subscription mutation ──
  const [postSubscription, { isLoading: isUpdatingSubscription }] =
    usePostSubscriptionMutation();

  const passengers = passengersData?.data ?? [];
  const meta = passengersData?.meta;

  const handleToggleStatus = useCallback(
    async (userId: string, currentStatus: boolean) => {
      try {
        await changeStatus({ userId, status: !currentStatus }).unwrap();
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

  // ── Open subscription modal seeded from passenger's own subscription data ──
  function openModal(type: ModalType, p: Passenger): void {
    const subPlan = (p.subscription.plan as PlanName) ?? "free";
    const cycle = p.subscription.billingCycle ?? "";

    // Free plan has no billing cycle — default period to monthly (UI hidden for free)
    // Lifetime billingCycle === "Lifetime" → matched to PERIODS[2]
    // Otherwise monthly / yearly matched normally
    const matchedPeriod: Period =
      subPlan === "free"
        ? PERIODS[0] // UI hidden for free, value doesn't matter
        : (PERIODS.find((pr) => pr.label === cycle) ?? PERIODS[0]);

    const isLifetimePlan =
      subPlan !== "free" && matchedPeriod.label === "Lifetime";

    const start = p.subscription.activatedAt
      ? toInputStr(new Date(p.subscription.activatedAt))
      : todayStr();

    // end date only meaningful for monthly/yearly — lifetime & free both use ""
    const end =
      subPlan === "free" || isLifetimePlan
        ? ""
        : p.subscription.expiryDate
          ? toInputStr(new Date(p.subscription.expiryDate))
          : matchedPeriod.months !== null
            ? toInputStr(
                calcEndDate(
                  new Date(start + "T00:00:00"),
                  matchedPeriod.months,
                ),
              )
            : "";

    setModal({
      type,
      passengerId: p.userId,
      plan: subPlan,
      period: matchedPeriod,
      startStr: subPlan === "free" ? todayStr() : start,
      endStr: end,
    });
  }

  function handleModalChange(patch: Partial<ModalState>): void {
    setModal((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  // ── Confirm: build the API body and call postSubscription ──
  async function handleConfirm(): Promise<void> {
    if (!modal) return;

    const isFree = modal.plan === "free";
    const isLifetime = modal.period.label === "Lifetime";

    // Build price number based on plan + period
    const priceNum = isFree
      ? 0
      : isLifetime
        ? (PLAN_PRICE_NUM[modal.plan]?.yearly ?? 0)
        : modal.period.label === "monthly"
          ? (PLAN_PRICE_NUM[modal.plan]?.monthly ?? 0)
          : (PLAN_PRICE_NUM[modal.plan]?.yearly ?? 0);

    const body = {
      userId: modal.passengerId,
      plan: modal.plan,
      billingCycle: isFree
        ? null
        : isLifetime
          ? "lifetime"
          : (modal.period.label as string),
      price: priceNum,
      activatedAt: isFree ? null : modal.startStr || null,
      expiryDate: isFree || isLifetime ? null : modal.endStr || null,
    };
    console.log("==================================");
    console.log(body);

    try {
      await postSubscription(body).unwrap();
      // Close only on success
      setModal(null);
    } catch (e) {
      console.error("Failed to update subscription:", e);
      // Modal stays open so the admin can retry
    }
  }

  function handleClose(): void {
    setModal(null);
  }

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

            {/* Live stats */}
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
                  "Plan",
                  "Subscription Period",
                  "Plan Dates",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="p-4 first:pl-8 last:pr-8 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap text-center"
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
                  <td colSpan={12} className="p-16 text-center">
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
                passengers.map((p) => {
                  // ── Per-row subscription data (reads directly from p.subscription) ──
                  const sub = p.subscription;
                  // isLifetime: non-free plan with no expiry date (free users also have no
                  // expiryDate, so we must exclude them to avoid showing "Never expires" wrongly)
                  const isLifetime = sub.plan !== "free" && !sub.expiryDate;

                  return (
                    <tr
                      key={p.userId}
                      className="hover:bg-gray-50 transition-colors group"
                    >
                      {/* Passenger */}
                      <td className="p-4 pl-8">
                        <div className="flex items-center gap-3">
                          <Avatar name={p.fullName} avatar={p.avatar} />
                          <div>
                            <div className="font-medium text-gray-900 text-sm">
                              {p.fullName}
                            </div>
                            <div className="text-xs text-gray-400 font-mono">
                              {p.accountId}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="p-4 text-sm text-gray-700">{p.email}</td>

                      {/* Phone */}
                      <td className="p-4 text-sm text-gray-700 whitespace-nowrap">
                        {p.phone ?? "—"}
                      </td>

                      {/* Rides */}
                      <td className="p-4 text-sm text-gray-700 text-center">
                        {p.totalRides}
                      </td>

                      {/* Rating */}
                      <td className="p-4">
                        <StarRating rating={p.avgRating} />
                      </td>

                      {/* Joined */}
                      <td className="p-4 text-sm text-gray-700 whitespace-nowrap">
                        {formatDate(p.createdAt)}
                      </td>

                      {/* Online */}
                      <td className="p-4">
                        <OnlineBadge isOnline={p.isOnline} />
                      </td>

                      {/* Plan — clickable, opens modal seeded from this passenger */}
                      <td className="px-4 py-4 text-center">
                        <CellBtn onClick={() => openModal("plan", p)}>
                          <PlanBadge plan={sub.plan} />
                        </CellBtn>
                      </td>

                      {/* Billing Cycle — clickable */}
                      <td className="px-4 py-4 text-center">
                        <CellBtn onClick={() => openModal("period", p)}>
                          {sub.billingCycle ? (
                            <span className="text-sm text-gray-700 capitalize">
                              {sub.billingCycle}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </CellBtn>
                      </td>

                      {/* Plan Dates — reads from p.subscription, NOT global state */}
                      <td className="px-4 py-4 text-center min-w-[140px]">
                        <div className="flex flex-col gap-1 text-xs">
                          <div className="rounded-md px-2 py-1 text-gray-500 bg-gray-50 border border-gray-100">
                            Start:{" "}
                            {sub.activatedAt
                              ? formatDate(sub.activatedAt)
                              : "—"}
                          </div>
                          {isLifetime ? (
                            <div className="inline-flex items-center justify-center gap-1 rounded-md px-2 py-1 text-amber-600 bg-amber-50 border border-amber-100">
                              <svg
                                width="11"
                                height="11"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#d97706"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                              Never expires
                            </div>
                          ) : (
                            <div className="rounded-md px-2 py-1 text-gray-500 bg-gray-50 border border-gray-100">
                              End:{" "}
                              {sub.expiryDate
                                ? formatDate(sub.expiryDate)
                                : "—"}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status toggle */}
                      <td className="p-4">
                        <StatusBadge
                          isActive={p.isActive}
                          isLoading={isChangingStatus}
                          onClick={() =>
                            handleToggleStatus(p.userId, p.isActive)
                          }
                        />
                      </td>

                      {/* Details */}
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
                  );
                })
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

      {/* Subscription Modal */}
      {modal && (
        <SubscriptionModal
          modal={modal}
          onClose={handleClose}
          onConfirm={handleConfirm}
          onChange={handleModalChange}
          isLoading={isUpdatingSubscription}
        />
      )}
    </div>
  );
}

// ── Subscription Modal ────────────────────────────────────────────────────────
function SubscriptionModal({
  modal,
  onClose,
  onConfirm,
  onChange,
  isLoading,
}: {
  modal: ModalState;
  onClose: () => void;
  onConfirm: () => void;
  onChange: (patch: Partial<ModalState>) => void;
  isLoading: boolean;
}) {
  const isLifetime =
    modal.period.months === null && modal.period.label === "Lifetime";
  const isFree = modal.plan === "free";

  function handleStartChange(s: string): void {
    if (isLifetime || isFree) {
      onChange({ startStr: s, endStr: "" });
    } else if (modal.period.months !== null) {
      const end = calcEndDate(new Date(s + "T00:00:00"), modal.period.months);
      onChange({ startStr: s, endStr: toInputStr(end) });
    }
  }

  function handlePeriodSelect(p: Period): void {
    if (p.label === "Lifetime") {
      onChange({ period: p, endStr: "" });
    } else if (p.months !== null) {
      const end = calcEndDate(new Date(modal.startStr + "T00:00:00"), p.months);
      onChange({ period: p, endStr: toInputStr(end) });
    }
  }

  // When plan switches to/from free, reset relevant fields
  function handlePlanSelect(planName: PlanName): void {
    if (planName === "free") {
      // Downgrade to free: clear period/dates (not sent to API anyway)
      onChange({
        plan: planName,
        period: PERIODS[0],
        startStr: todayStr(),
        endStr: "",
      });
    } else if (isFree) {
      // Upgrading FROM free: default to monthly + recalculate end date
      const defaultPeriod = PERIODS[0]; // monthly
      const start = todayStr();
      const end = toInputStr(
        calcEndDate(new Date(start + "T00:00:00"), defaultPeriod.months!),
      );
      onChange({
        plan: planName,
        period: defaultPeriod,
        startStr: start,
        endStr: end,
      });
    } else {
      // Switching between paid plans: keep period & dates, just update plan
      onChange({ plan: planName });
    }
  }

  // Determine price to show based on current selections
  const priceMap = PLAN_PRICE[modal.plan] ?? { monthly: "—", yearly: "—" };
  const priceDisplay = isFree
    ? "Free"
    : modal.period.label === "monthly"
      ? priceMap.monthly
      : modal.period.label === "yearly"
        ? priceMap.yearly
        : modal.plan === "free"
          ? "Free"
          : "0";

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl p-8"
        style={{
          background: "rgb(5, 63, 83)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
          animation: "fadeUp .2s ease",
        }}
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">
              Change
            </p>
            <h2 className="text-2xl font-light text-slate-50 tracking-tight">
              Subscription Plan
            </h2>
          </div>
          {/* Price pill */}
          {priceDisplay && priceDisplay !== "—" && (
            <div
              className="mt-1 px-3 py-1.5 rounded-xl text-sm font-semibold"
              style={{
                background: isFree
                  ? "rgba(156,163,175,0.15)"
                  : "rgba(96,165,250,0.15)",
                border: isFree
                  ? "1px solid rgba(156,163,175,0.35)"
                  : "1px solid rgba(96,165,250,0.35)",
                color: isFree ? "#9ca3af" : "#60a5fa",
              }}
            >
              {priceDisplay}
            </div>
          )}
        </div>

        {/* Plan selector */}
        <div className="mb-5">
          <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">
            Select Plan
          </label>
          <div className="flex flex-col gap-2">
            {PLANS.map((planName) => {
              const active = modal.plan === planName;
              const color = PLAN_COLOR[planName] ?? "#9ca3af";
              return (
                <button
                  key={planName}
                  onClick={() => handlePlanSelect(planName)}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm transition-all duration-200"
                  style={{
                    background: active
                      ? `${color}18`
                      : "rgba(255,255,255,0.03)",
                    border: `1px solid ${active ? color + "55" : "rgba(255,255,255,0.08)"}`,
                    color: active ? color : "#94a3b8",
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: color }}
                    />
                    <span className="capitalize">{planName}</span>
                  </span>
                  {/* Price hint per plan for this period */}
                  {!isFree &&
                    modal.period.label !== "Lifetime" &&
                    planName !== "free" && (
                      <span className="text-xs opacity-60">
                        {modal.period.label === "monthly"
                          ? PLAN_PRICE[planName].monthly
                          : modal.period.label === "yearly"
                            ? PLAN_PRICE[planName].yearly
                            : ""}
                      </span>
                    )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Period selector — hidden when free plan selected */}
        {!isFree && (
          <div className="mb-5">
            <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">
              Select Period
            </label>
            <div className="flex flex-col gap-2">
              {PERIODS.map((p) => {
                const active = modal.period.label === p.label;
                const isLife = p.label === "Lifetime";
                return (
                  <button
                    key={p.label}
                    onClick={() => handlePeriodSelect(p)}
                    className="flex items-center justify-center rounded-xl px-4 py-3 text-sm text-center transition-all duration-200"
                    style={{
                      background: active
                        ? isLife
                          ? "rgba(251,191,36,0.12)"
                          : "rgba(96,165,250,0.12)"
                        : "rgba(255,255,255,0.03)",
                      border: `1px solid ${
                        active
                          ? isLife
                            ? "rgba(251,191,36,0.45)"
                            : "rgba(96,165,250,0.4)"
                          : "rgba(255,255,255,0.08)"
                      }`,
                      color: active
                        ? isLife
                          ? "#fbbf24"
                          : "#60a5fa"
                        : "#94a3b8",
                      fontFamily: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    <span className="flex items-center gap-2">
                      {isLife && (
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={active ? "#fbbf24" : "#64748b"}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      )}
                      <span className="capitalize">{p.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Dates — hidden when free plan selected */}
        {!isFree && (
          <div className="flex gap-3 mb-7">
            <div className="flex-1">
              <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={modal.startStr}
                onChange={(e) => handleStartChange(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm text-slate-100 outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  colorScheme: "dark",
                  fontFamily: "inherit",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(99,179,237,0.5)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.12)")
                }
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">
                End Date
              </label>
              {isLifetime ? (
                <div
                  className="w-full rounded-lg px-3 py-2 text-sm text-amber-400 flex items-center gap-1.5"
                  style={{
                    background: "rgba(251,191,36,0.08)",
                    border: "1px solid rgba(251,191,36,0.25)",
                  }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  Never expires
                </div>
              ) : (
                <input
                  type="date"
                  value={modal.endStr}
                  onChange={(e) => onChange({ endStr: e.target.value })}
                  className="w-full rounded-lg px-3 py-2 text-sm text-slate-100 outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    colorScheme: "dark",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(99,179,237,0.5)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.12)")
                  }
                />
              )}
            </div>
          </div>
        )}

        {/* Free plan notice */}
        {isFree && (
          <div
            className="mb-7 rounded-xl px-4 py-3 text-sm text-slate-400 flex items-center gap-2"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Downgrading to free will remove all billing cycle and expiry date
            information.
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-xl py-3 text-sm text-slate-400 transition-all duration-200 hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              fontFamily: "inherit",
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.09)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
            }
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-[2] rounded-xl py-3 text-sm font-semibold uppercase tracking-wider text-white transition-opacity duration-200 hover:opacity-85 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg,#3b82f6,#2563eb)",
              border: "none",
              boxShadow: "0 4px 16px rgba(59,130,246,0.35)",
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            {isLoading ? "Saving…" : "Confirm Changes"}
          </button>
        </div>
      </div>

      <style>{`@keyframes fadeUp {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }`}</style>
    </div>
  );
}

// ── Clickable Cell Button ─────────────────────────────────────────────────────
function CellBtn({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#000] transition-all duration-200"
      style={{
        background: "transparent",
        border: "1px solid rgba(0,0,0,0.08)",
        fontFamily: "inherit",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(5,63,83,0.25)";
        e.currentTarget.style.background = "rgba(5,63,83,0.04)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)";
        e.currentTarget.style.background = "transparent";
      }}
    >
      {children}
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#64748b"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="flex-shrink-0"
      >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    </button>
  );
}
