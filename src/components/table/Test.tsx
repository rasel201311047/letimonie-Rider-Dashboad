import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type PlanName = "Starter" | "Pro" | "Enterprise";
type PeriodLabel = "Monthly" | "Quarterly" | "Yearly" | "Lifetime";
type ModalType = "plan" | "period" | null;

interface Period {
  label: PeriodLabel;
  months: number | null; // null = Lifetime (no end date)
}

interface ModalState {
  type: ModalType;
  plan: PlanName;
  period: Period;
  startStr: string;
  endStr: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const PLANS: PlanName[] = ["Starter", "Pro", "Enterprise"];

const PERIODS: Period[] = [
  { label: "Monthly", months: 1 },
  { label: "Quarterly", months: 3 },
  { label: "Yearly", months: 12 },
  { label: "Lifetime", months: null },
];

const PLAN_PRICE: Record<PlanName, Record<PeriodLabel, number>> = {
  Starter: { Monthly: 9, Quarterly: 25, Yearly: 89, Lifetime: 199 },
  Pro: { Monthly: 29, Quarterly: 79, Yearly: 279, Lifetime: 599 },
  Enterprise: { Monthly: 99, Quarterly: 269, Yearly: 949, Lifetime: 1999 },
};

const PLAN_COLOR: Record<PlanName, string> = {
  Starter: "#34d399",
  Pro: "#60a5fa",
  Enterprise: "#f472b6",
};

const PERIOD_SHORT: Record<PeriodLabel, string> = {
  Monthly: "mo",
  Quarterly: "qtr",
  Yearly: "yr",
  Lifetime: "once",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

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

// ── Modal Component ───────────────────────────────────────────────────────────
function Modal({
  modal,
  onClose,
  onConfirm,
  onChange,
}: {
  modal: ModalState;
  onClose: () => void;
  onConfirm: () => void;
  onChange: (patch: Partial<ModalState>) => void;
}) {
  const isLifetime = modal.period.months === null;

  function handleStartChange(s: string): void {
    if (isLifetime) {
      onChange({ startStr: s, endStr: "" });
    } else {
      const end = calcEndDate(new Date(s + "T00:00:00"), modal.period.months!);
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
          background: "#0f172a",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
          animation: "fadeUp .2s ease",
        }}
      >
        {/* Modal Header */}
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">
            Change
          </p>
          <h2 className="text-2xl font-light text-slate-50 tracking-tight">
            {modal.type === "plan"
              ? "Subscription Plan"
              : "Subscription Period"}
          </h2>
        </div>

        {/* Plan selector */}
        <div className="mb-5">
          <label className="block text-xs uppercase tracking-widest text-slate-400 mb-2">
            Select Plan
          </label>
          <div className="flex flex-col gap-2">
            {PLANS.map((p) => {
              const active = modal.plan === p;
              return (
                <button
                  key={p}
                  onClick={() => onChange({ plan: p })}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-left transition-all duration-200"
                  style={{
                    background: active
                      ? `${PLAN_COLOR[p]}18`
                      : "rgba(255,255,255,0.03)",
                    border: `1px solid ${active ? PLAN_COLOR[p] + "55" : "rgba(255,255,255,0.08)"}`,
                    color: active ? PLAN_COLOR[p] : "#94a3b8",
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: PLAN_COLOR[p] }}
                    />
                    {p}
                  </span>
                  <span className="text-xs text-slate-500">
                    ${PLAN_PRICE[p][modal.period.label]}/
                    {PERIOD_SHORT[modal.period.label]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Period selector */}
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
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-left transition-all duration-200"
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
                    {p.label}
                  </span>
                  <span className="text-xs text-slate-500">
                    ${PLAN_PRICE[modal.plan][p.label]}/{PERIOD_SHORT[p.label]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dates */}
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

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl py-3 text-sm text-slate-400 transition-all duration-200 hover:text-slate-200"
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
            className="flex-[2] rounded-xl py-3 text-sm font-semibold uppercase tracking-wider text-white transition-opacity duration-200 hover:opacity-85"
            style={{
              background: "linear-gradient(135deg,#3b82f6,#2563eb)",
              border: "none",
              boxShadow: "0 4px 16px rgba(59,130,246,0.35)",
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            Confirm Changes
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
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-100 transition-all duration-200 group"
      style={{
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.08)",
        fontFamily: "inherit",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(99,179,237,0.45)";
        e.currentTarget.style.background = "rgba(99,179,237,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
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

// ── Main Component ────────────────────────────────────────────────────────────
export default function SubscriptionTable() {
  const initStart = todayStr();
  const initEnd = toInputStr(
    calcEndDate(new Date(initStart + "T00:00:00"), PERIODS[0].months!),
  );

  const [plan, setPlan] = useState<PlanName>("Pro");
  const [period, setPeriod] = useState<Period>(PERIODS[0]);
  const [startStr, setStartStr] = useState<string>(initStart);
  const [endStr, setEndStr] = useState<string>(initEnd);
  const [modal, setModal] = useState<ModalState | null>(null);

  function openModal(type: ModalType): void {
    setModal({ type, plan, period, startStr, endStr });
  }

  function handleModalChange(patch: Partial<ModalState>): void {
    setModal((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  function handleConfirm(): void {
    if (!modal) return;
    setPlan(modal.plan);
    setPeriod(modal.period);
    setStartStr(modal.startStr);
    setEndStr(modal.endStr);
    setModal(null);
  }

  function handleClose(): void {
    setModal(null);
  }

  const startDate = new Date(startStr + "T00:00:00");
  const isLifetime = period.months === null;
  const endDate = !isLifetime && endStr ? new Date(endStr + "T00:00:00") : null;
  const price = PLAN_PRICE[plan][period.label];

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        background:
          "linear-gradient(160deg, #0b1120 0%, #0f172a 60%, #0c1a2e 100%)",
        fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
      }}
    >
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">
            Manage
          </p>
          <h1 className="text-4xl font-light text-slate-50 tracking-tight">
            Subscription
          </h1>
        </div>

        {/* Table Card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
          }}
        >
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                {[
                  "Plan Name",
                  "Subscription Period",
                  "Start Date",
                  "End Date",
                  "Price",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-4 text-left text-xs uppercase tracking-widest font-medium text-slate-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <tr>
                {/* Plan Name */}
                <td className="px-5 py-5">
                  <CellBtn onClick={() => openModal("plan")}>
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: PLAN_COLOR[plan] }}
                    />
                    {plan}
                  </CellBtn>
                </td>

                {/* Subscription Period */}
                <td className="px-5 py-5">
                  <CellBtn onClick={() => openModal("period")}>
                    {isLifetime && (
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
                    )}
                    {period.label}
                  </CellBtn>
                </td>

                {/* Start Date */}
                <td className="px-5 py-5">
                  <div
                    className="inline-block rounded-lg px-4 py-2 text-sm text-slate-400"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {formatDate(startDate)}
                  </div>
                </td>

                {/* End Date */}
                <td className="px-5 py-5">
                  {isLifetime ? (
                    <div
                      className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm text-amber-400"
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
                    <div
                      className="inline-block rounded-lg px-4 py-2 text-sm text-slate-400"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {endDate ? formatDate(endDate) : "—"}
                    </div>
                  )}
                </td>

                {/* Price */}
                <td className="px-5 py-5">
                  <div
                    className="inline-flex items-baseline gap-0.5 rounded-lg px-4 py-1.5"
                    style={{
                      background: isLifetime
                        ? "rgba(251,191,36,0.08)"
                        : "rgba(96,165,250,0.08)",
                      border: `1px solid ${isLifetime ? "rgba(251,191,36,0.25)" : "rgba(96,165,250,0.2)"}`,
                    }}
                  >
                    <span
                      className={`text-xs ${isLifetime ? "text-amber-400" : "text-blue-400"}`}
                    >
                      $
                    </span>
                    <span className="text-slate-100 text-lg font-medium">
                      {price}
                    </span>
                    <span className="text-slate-500 text-xs ml-0.5">
                      /{PERIOD_SHORT[period.label]}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(0,0,0,0.15)",
            }}
          >
            <span className="text-xs text-slate-500">
              {plan} · {period.label} · {formatDate(startDate)} →{" "}
              {isLifetime
                ? "Never expires"
                : endDate
                  ? formatDate(endDate)
                  : "—"}
            </span>
            <button
              className="px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-widest text-white transition-opacity duration-200 hover:opacity-85"
              style={{
                background: "linear-gradient(135deg,#3b82f6,#2563eb)",
                border: "none",
                boxShadow: "0 4px 16px rgba(59,130,246,0.35)",
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              Confirm Subscription
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <Modal
          modal={modal}
          onClose={handleClose}
          onConfirm={handleConfirm}
          onChange={handleModalChange}
        />
      )}
    </div>
  );
}
