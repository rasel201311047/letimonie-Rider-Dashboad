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
import { BlockReasonModal } from "../modal/BlockReasonModal";
import NotificationModal from "../modal/NotificationModal";
import { usePostSubscriptionMutation } from "../../rtkquery/page/passengersApi";
import type { PostSubscriptionRequest } from "../../types/subcriptiontype";

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;
type FilterType = "all" | "active" | "blocked" | "pending";

// ─── Subscription Types ───────────────────────────────────────────────────────

type PlanName = "free" | "premium" | "premium-plus" | "all-access";
type PeriodLabel = "" | "monthly" | "yearly" | "lifetime";

interface Period {
  label: PeriodLabel;
  months: number | null;
}

interface SubModalState {
  passengerId: string;
  plan: PlanName;
  period: Period;
  startStr: string;
  endStr: string;
}

// ─── Subscription Data ────────────────────────────────────────────────────────

const PLANS: PlanName[] = ["free", "premium", "premium-plus", "all-access"];

const PERIODS: Period[] = [
  { label: "monthly", months: 1 },
  { label: "yearly", months: 12 },
  { label: "lifetime", months: null },
];

const PLAN_COLOR: Record<string, string> = {
  free: "rgb(156,163,175)",
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

const PLAN_PRICE_NUM: Record<string, { monthly: number; yearly: number }> = {
  free: { monthly: 0, yearly: 0 },
  premium: { monthly: 4, yearly: 40 },
  "premium-plus": { monthly: 7, yearly: 70 },
  "all-access": { monthly: 6, yearly: 60 },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function formatTableDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function useDebounce<T>(value: T, delay = 500): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusBadge: React.FC<{ isActive: boolean | null }> = ({ isActive }) => {
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

const VerificationBadge: React.FC<{ isActive: boolean | null }> = ({
  isActive,
}) => {
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

// ─── Plan Badge ───────────────────────────────────────────────────────────────

const PlanBadge: React.FC<{ plan: string }> = ({ plan }) => {
  const color = PLAN_COLOR[plan] ?? "#9ca3af";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize"
      style={{
        background: color + "18",
        border: `1px solid ${color}55`,
        color,
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

// ─── Cell Button ─────────────────────────────────────────────────────────────

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

// ─── Pagination ───────────────────────────────────────────────────────────────

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
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
              onClick={() => onPageChange(page as number)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${currentPage === page ? "bg-[#053F53] text-white shadow-sm" : "hover:bg-gray-100 text-gray-700 border border-gray-200"}`}
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

// ─── Driver Document Modal ────────────────────────────────────────────────────

const DriverDocumentModal: React.FC<{
  open: boolean;
  driver: DriverListItem | null;
  onClose: () => void;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
  isChanging: boolean;
  handlblock: (driver: DriverListItem) => void;
  // ✅ NEW: separate handler to activate a blocked driver directly
  handleActivate: (userId: string) => void;
}> = ({
  open,
  driver,
  onClose,
  onApprove,
  onReject,
  isChanging,
  handlblock,
  handleActivate,
}) => {
  const { data: detailsData, isLoading: detailsLoading } =
    useGetDriverDetailsQuery(driver?.driverId ?? "", {
      skip: !open || !driver,
    });
  const [openNotification, setOpenNotification] = useState(false);

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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpenNotification(true)}
              className="bg-gradient-to-br from-[#053F53] to-[#047094] text-[10px] font-bold text-white px-4 py-2 rounded-2xl"
            >
              Send Notification
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={24} className="text-gray-500 hover:text-gray-700" />
            </button>
          </div>
        </div>

        {/* Action Banner — Pending: show Approve + Reject */}
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

        {/* Action Banner — Active: show Block button (requires reason) */}
        {driver.isActive === true && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-blue-600" size={20} />
                <span className="font-medium text-blue-800">
                  Block the driver
                </span>
              </div>
              <button
                disabled={isChanging}
                onClick={() => driver && handlblock(driver)}
                className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-60"
              >
                {isChanging ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <UserX size={18} />
                )}
                Block
              </button>
            </div>
          </div>
        )}

        {/* Action Banner — Blocked: show Activate button (no reason needed) */}
        {driver.isActive === false && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-blue-600" size={20} />
                <span className="font-medium text-blue-800">
                  The driver is blocked. Do you want to activate?
                </span>
              </div>
              <button
                disabled={isChanging}
                onClick={() => handleActivate(driver.userId)}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-60"
              >
                {isChanging ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <UserCheck size={18} />
                )}
                Activate Driver
              </button>
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
              <section className="bg-gray-50 rounded-xl p-5 border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Car size={20} className="text-[#053F53]" />
                  Vehicle Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  {[
                    { label: "Car Model", value: details.carModel },
                    { label: "License Plate", value: details.licensePlate },
                    { label: "Vehicle Type", value: details.vehicleType },
                    { label: "License Number", value: details.licenseNumber },
                    { label: "Governorate", value: details.governorate },
                    { label: "Languages", value: details.languages.join(", ") },
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
                      <ExternalLink size={14} />
                      Open full size
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
              {details.carImages.length > 0 && (
                <section>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Vehicle Photos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {details.carImages.map((img: string, idx: number) => (
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
      <NotificationModal
        userid={driver.userId}
        opennotification={openNotification}
        onCloseotification={() => setOpenNotification(false)}
      />
    </div>
  );
};

// ─── Subscription Modal ───────────────────────────────────────────────────────

function SubscriptionModal({
  modal,
  onClose,
  onConfirm,
  onChange,
  isLoading,
}: {
  modal: SubModalState;
  onClose: () => void;
  onConfirm: () => void;
  onChange: (patch: Partial<SubModalState>) => void;
  isLoading: boolean;
}) {
  const isFree = modal.plan === "free";
  const isLifetime =
    modal.period.label === "lifetime" && modal.period.months === null;

  function handleStartChange(s: string): void {
    if (isFree || isLifetime) {
      onChange({ startStr: s, endStr: "" });
    } else if (modal.period.months !== null) {
      const end = calcEndDate(new Date(s + "T00:00:00"), modal.period.months);
      onChange({ startStr: s, endStr: toInputStr(end) });
    }
  }

  function handlePeriodSelect(p: Period): void {
    if (p.months === null) {
      onChange({ period: p, endStr: "" });
    } else {
      const end = calcEndDate(new Date(modal.startStr + "T00:00:00"), p.months);
      onChange({ period: p, endStr: toInputStr(end) });
    }
  }

  function handlePlanSelect(planName: PlanName): void {
    if (planName === "free") {
      onChange({
        plan: planName,
        period: PERIODS[0],
        startStr: todayStr(),
        endStr: "",
      });
    } else if (isFree) {
      const defaultPeriod = PERIODS[0];
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
      onChange({ plan: planName });
    }
  }

  const priceMap = PLAN_PRICE[modal.plan] ?? { monthly: "—", yearly: "—" };
  const priceDisplay = isFree
    ? "Free"
    : modal.period.label === "monthly"
      ? priceMap.monthly
      : modal.period.label === "yearly"
        ? priceMap.yearly
        : "—";

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
          background: "rgb(5,63,83)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          fontFamily: "'Palatino Linotype','Book Antiqua',Palatino,serif",
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
                  {!isFree &&
                    modal.period.label !== "lifetime" &&
                    planName !== "free" && (
                      <span className="text-xs opacity-60">
                        {modal.period.label === "monthly"
                          ? PLAN_PRICE[planName].monthly
                          : PLAN_PRICE[planName].yearly}
                      </span>
                    )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Period selector — hidden for free */}
        {!isFree && (
          <div className="mb-5">
            <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">
              Select Period
            </label>
            <div className="flex flex-col gap-2">
              {PERIODS.map((p) => {
                const active = modal.period.label === p.label;
                const isLife = p.months === null;
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
                      border: `1px solid ${active ? (isLife ? "rgba(251,191,36,0.45)" : "rgba(96,165,250,0.4)") : "rgba(255,255,255,0.08)"}`,
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

        {/* Dates — hidden for free */}
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

        {/* Free notice */}
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
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}

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
  const [blockTarget, setBlockTarget] = useState<DriverListItem | null>(null);
  const [subModal, setSubModal] = useState<SubModalState | null>(null);

  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // ── API ──────────────────────────────────────────────────────────────────────

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
  const [postSubscription, { isLoading: isUpdatingSubscription }] =
    usePostSubscriptionMutation();

  // ── Derived ──────────────────────────────────────────────────────────────────

  const allDrivers = driversData?.data ?? [];
  const meta = driversData?.meta;
  const stats = statsData?.data;

  const filteredDrivers = allDrivers.filter((d) => {
    if (filter === "all") return true;
    if (filter === "active") return d.isActive === true;
    if (filter === "blocked") return d.isActive === false;
    if (filter === "pending") return d.isActive === null;
    return true;
  });

  const totalPages = meta?.totalPages ?? 1;

  // ── Status Handlers ───────────────────────────────────────────────────────────

  /**
   * Approve a pending driver — sets isActive: true, no reason needed.
   * Also used when activating a previously blocked driver from the doc modal.
   */
  const handleApprove = useCallback(
    async (userId: string) => {
      await changeStatus({ userId, status: { status: true, reason: "" } });
      setOpenModal(false);
    },
    [changeStatus],
  );

  /**
   * Reject a pending driver — sets isActive: false, no reason needed.
   */
  const handleReject = useCallback(
    async (userId: string) => {
      await changeStatus({ userId, status: { status: false, reason: "" } });
      setOpenModal(false);
    },
    [changeStatus],
  );

  /**
   * ✅ Activate a blocked driver directly — no reason needed.
   * Called from the doc modal "Activate Driver" button and the table action button.
   */
  const handleActivateBlocked = useCallback(
    async (userId: string) => {
      await changeStatus({ userId, status: { status: true, reason: "" } });
      setOpenModal(false);
    },
    [changeStatus],
  );

  /**
   * ✅ Open block modal — only called for ACTIVE drivers.
   * Requires a reason before confirming.
   */
  const handleOpenBlockModal = (driver: DriverListItem) => {
    // Only active drivers can be blocked via this path
    if (driver.isActive === true) {
      setBlockTarget(driver);
    }
  };

  /**
   * ✅ Confirm block with reason — called from BlockReasonModal.
   */
  const handleBlockConfirm = async (reason: string) => {
    if (!blockTarget) return;
    await changeStatus({
      userId: blockTarget.userId,
      status: { status: false, reason },
    });
    setBlockTarget(null);
    setOpenModal(false);
  };

  // ── Subscription Handlers ─────────────────────────────────────────────────────

  function openSubModal(driver: DriverListItem): void {
    const sub = driver.subscription;
    const subPlan = (sub.plan as PlanName) ?? "free";
    const cycle = (sub.billingCycle ?? "") as PeriodLabel;

    const matchedPeriod: Period =
      subPlan === "free"
        ? PERIODS[0]
        : (PERIODS.find((pr) => pr.label === cycle) ?? PERIODS[0]);

    const isLifetimePlan =
      subPlan !== "free" && matchedPeriod.label === "lifetime";

    const start = sub.activatedAt
      ? toInputStr(new Date(sub.activatedAt))
      : todayStr();

    const end =
      subPlan === "free" || isLifetimePlan
        ? ""
        : sub.expiryDate
          ? toInputStr(new Date(sub.expiryDate))
          : matchedPeriod.months !== null
            ? toInputStr(
                calcEndDate(
                  new Date(start + "T00:00:00"),
                  matchedPeriod.months,
                ),
              )
            : "";

    setSubModal({
      passengerId: driver.userId,
      plan: subPlan,
      period: matchedPeriod,
      startStr: subPlan === "free" ? todayStr() : start,
      endStr: end,
    });
  }

  function handleSubModalChange(patch: Partial<SubModalState>): void {
    setSubModal((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  async function handleSubConfirm(): Promise<void> {
    if (!subModal) return;

    const isFree = subModal.plan === "free";
    const isLifetime = subModal.period.label === "lifetime";

    const priceNum = isFree
      ? 0
      : isLifetime
        ? (PLAN_PRICE_NUM[subModal.plan]?.yearly ?? 0)
        : subModal.period.label === "monthly"
          ? (PLAN_PRICE_NUM[subModal.plan]?.monthly ?? 0)
          : (PLAN_PRICE_NUM[subModal.plan]?.yearly ?? 0);

    const body = {
      userId: subModal.passengerId,
      plan: subModal.plan,
      billingCycle: (isFree
        ? null
        : subModal.period.label) as PostSubscriptionRequest["billingCycle"],
      price: priceNum,
      activatedAt: isFree ? null : subModal.startStr || null,
      expiryDate: isFree || isLifetime ? null : subModal.endStr || null,
    };

    try {
      await postSubscription(body).unwrap();
      setSubModal(null);
    } catch (e) {
      console.error("Failed to update subscription:", e);
    }
  }

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

              {/* Filter */}
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
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${filter === opt.value ? "bg-[#053F53]/10 text-[#053F53] font-medium" : "hover:bg-gray-100 text-gray-700"}`}
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
                <th className="p-4 pl-6 whitespace-nowrap">Driver</th>
                <th className="p-4 whitespace-nowrap">Contact</th>
                <th className="p-4 whitespace-nowrap">Rating</th>
                <th className="p-4 whitespace-nowrap">Trips</th>
                <th className="p-4 whitespace-nowrap">Online</th>
                <th className="p-4 whitespace-nowrap">Plan</th>
                <th className="p-4 whitespace-nowrap">Billing Cycle</th>
                <th className="p-4 whitespace-nowrap">Plan Dates</th>
                <th className="p-4 whitespace-nowrap">Status</th>
                <th className="p-4 whitespace-nowrap">Verification</th>
                <th className="p-4 whitespace-nowrap">Details</th>
                <th className="p-4 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {driversLoading ? (
                <tr>
                  <td colSpan={12} className="py-20 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 size={36} className="animate-spin" />
                      <p>Loading drivers…</p>
                    </div>
                  </td>
                </tr>
              ) : driversError ? (
                <tr>
                  <td colSpan={12} className="py-20 text-center text-red-400">
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
                  <td colSpan={12} className="py-20 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-3">
                      <Search size={36} />
                      <p>No drivers found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDrivers.map((driver) => {
                  const sub = driver.subscription;
                  const isPending = driver.isActive === null;
                  const isActive = driver.isActive === true;
                  const isBlocked = driver.isActive === false;
                  const status = toDriverStatus(driver.isActive);

                  const driverIsLifetime =
                    sub.plan !== "free" && !sub.expiryDate;

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

                      {/* Online */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium ${driver.isOnline ? "text-green-600" : "text-gray-400"}`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${driver.isOnline ? "bg-green-500" : "bg-gray-300"}`}
                          />
                          {driver.isOnline ? "Online" : "Offline"}
                        </span>
                      </td>

                      {/* Plan */}
                      <td className="p-4">
                        <CellBtn onClick={() => openSubModal(driver)}>
                          <PlanBadge plan={sub.plan} />
                        </CellBtn>
                      </td>

                      {/* Billing Cycle */}
                      <td className="p-4">
                        <CellBtn onClick={() => openSubModal(driver)}>
                          {sub.billingCycle ? (
                            <span className="text-sm text-gray-700 capitalize">
                              {sub.billingCycle}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </CellBtn>
                      </td>

                      {/* Plan Dates */}
                      <td className="p-4 min-w-[150px]">
                        <div className="flex flex-col gap-1 text-xs">
                          <div className="rounded-md px-2 py-1 text-gray-500 bg-gray-50 border border-gray-100">
                            Start: {formatTableDate(sub.activatedAt)}
                          </div>
                          {driverIsLifetime ? (
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
                              End: {formatTableDate(sub.expiryDate)}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <StatusBadge isActive={driver.isActive} />
                      </td>

                      {/* Verification */}
                      <td className="p-4">
                        <VerificationBadge isActive={driver.isActive} />
                      </td>

                      {/* Details */}
                      <td className="p-4">
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
                      </td>

                      {/* ✅ Actions — fixed logic */}
                      <td className="p-4 pr-6">
                        <div className="flex items-center gap-1">
                          {/* Pending: Approve + Reject */}
                          {isPending && (
                            <>
                              <button
                                disabled={isChanging}
                                onClick={() => handleApprove(driver.userId)}
                                className="p-2 hover:bg-green-100 rounded-lg transition-colors text-green-600 disabled:opacity-50"
                                title="Approve"
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
                                title="Reject"
                              >
                                {isChanging ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <X size={16} />
                                )}
                              </button>
                            </>
                          )}

                          {/* ✅ Active: Block button — opens BlockReasonModal (reason required) */}
                          {isActive && (
                            <button
                              disabled={isChanging}
                              onClick={() => handleOpenBlockModal(driver)}
                              className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600 disabled:opacity-50"
                              title="Block Driver"
                            >
                              {isChanging ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <UserX size={16} />
                              )}
                            </button>
                          )}

                          {/* ✅ Blocked: Activate button — no reason needed, direct call */}
                          {isBlocked && (
                            <button
                              disabled={isChanging}
                              onClick={() =>
                                handleActivateBlocked(driver.userId)
                              }
                              className="p-2 hover:bg-green-100 rounded-lg transition-colors text-green-600 disabled:opacity-50"
                              title="Activate Driver"
                            >
                              {isChanging ? (
                                <Loader2 size={16} className="animate-spin" />
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
            onPageChange={setPage}
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
        handlblock={handleOpenBlockModal}
        handleActivate={handleActivateBlocked}
      />

      {/* Block Modal — only shown when blocking an active driver */}
      <BlockReasonModal
        open={!!blockTarget}
        driverName={blockTarget?.fullName ?? ""}
        onClose={() => setBlockTarget(null)}
        onConfirm={handleBlockConfirm}
        isLoading={isChanging}
      />

      {/* Subscription Modal */}
      {subModal && (
        <SubscriptionModal
          modal={subModal}
          onClose={() => setSubModal(null)}
          onConfirm={handleSubConfirm}
          onChange={handleSubModalChange}
          isLoading={isUpdatingSubscription}
        />
      )}
    </div>
  );
}
