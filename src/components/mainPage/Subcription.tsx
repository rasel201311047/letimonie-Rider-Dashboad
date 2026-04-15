import { useState } from "react";
import {
  Users,
  CheckCircle,
  Clock,
  Search,
  Eye,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Crown,
  Star,
  Zap,
  Shield,
  Car,
  Phone,
  Mail,
  MapPin,
  Calendar,
  X,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  useGetSubscriptionActivitiesQuery,
  useGetSubscriptionRequestsQuery,
  useGetUserSubscriptionDetailQuery,
  useChangeSubscriptionStatusMutation,
} from "../../rtkquery/page/subcriptionApi";
import type { SubscriptionRequest } from "../../types/subcriptiontype";

// ─── Plan Badge Config ────────────────────────────────────────────────────────
const planConfig: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  free: {
    label: "Free",
    color: "#6b7280",
    bg: "#f3f4f6",
    icon: <Shield className="w-3.5 h-3.5" />,
  },
  premium: {
    label: "Premium",
    color: "#d97706",
    bg: "#fef3c7",
    icon: <Star className="w-3.5 h-3.5" />,
  },
  "premium-plus": {
    label: "Premium+",
    color: "#7c3aed",
    bg: "#ede9fe",
    icon: <Crown className="w-3.5 h-3.5" />,
  },
  allAccess: {
    label: "All Access",
    color: "#0891b2",
    bg: "#e0f2fe",
    icon: <Zap className="w-3.5 h-3.5" />,
  },
};

const getPlanConfig = (plan: string) =>
  planConfig[plan] ?? {
    label: plan,
    color: "#053F53",
    bg: "#e0f0f5",
    icon: <Shield className="w-3.5 h-3.5" />,
  };

// ─── Plan Badge ───────────────────────────────────────────────────────────────
const PlanBadge = ({ plan }: { plan: string }) => {
  const cfg = getPlanConfig(plan);
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { color: string; bg: string; label: string }> = {
    pending: { color: "#d97706", bg: "#fef3c7", label: "Pending" },
    approved: { color: "#059669", bg: "#d1fae5", label: "Approved" },
    active: { color: "#059669", bg: "#d1fae5", label: "Active" },
    rejected: { color: "#dc2626", bg: "#fee2e2", label: "Rejected" },
    cancelled: { color: "#6b7280", bg: "#f3f4f6", label: "Cancelled" },
  };
  const cfg = map[status] ?? { color: "#053F53", bg: "#e0f0f5", label: status };
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: cfg.color }}
      />
      {cfg.label}
    </span>
  );
};

// ─── User Detail Modal ────────────────────────────────────────────────────────
const UserDetailModal = ({
  userId,
  onClose,
  onApprove,
  onReject,
  isActioning,
}: {
  userId: string;
  onClose: () => void;
  onApprove: (userId: string, plan: string) => void;
  onReject: (userId: string, plan: string) => void;
  isActioning: boolean;
}) => {
  const { data, isLoading, isError } =
    useGetUserSubscriptionDetailQuery(userId);
  const user = data?.data;
  const driver = user?.driverData;
  const sub = user?.subscription;
  const upgradeReq = sub?.upgradeRequest;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div
          className="p-6 text-white rounded-t-2xl flex items-center justify-between"
          style={{ backgroundColor: "#053F53" }}
        >
          <h2 className="text-xl font-bold">Subscription Request Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2
                className="w-8 h-8 animate-spin"
                style={{ color: "#053F53" }}
              />
              <p className="text-gray-500 text-sm">Loading user details...</p>
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-red-500">
              <AlertCircle className="w-8 h-8" />
              <p className="text-sm">Failed to load user details.</p>
            </div>
          )}

          {user && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                  {driver?.avatar ? (
                    <img
                      src={driver.avatar}
                      alt={user.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-2xl font-bold text-white"
                      style={{ backgroundColor: "#053F53" }}
                    >
                      {user.fullName[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {user.fullName}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <StatusBadge
                      status={user.isActive ? "active" : "inactive"}
                    />
                    <PlanBadge plan={sub?.plan ?? "free"} />
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { icon: <Mail className="w-4 h-4" />, value: user.email },
                  { icon: <Phone className="w-4 h-4" />, value: driver?.phone },
                  {
                    icon: <MapPin className="w-4 h-4" />,
                    value: driver?.governorate,
                  },
                  {
                    icon: <Calendar className="w-4 h-4" />,
                    value: driver?.dateOfBirth
                      ? `Born: ${driver.dateOfBirth}`
                      : null,
                  },
                ]
                  .filter((i) => i.value)
                  .map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg"
                    >
                      <span style={{ color: "#053F53" }}>{item.icon}</span>
                      {item.value}
                    </div>
                  ))}
              </div>

              {/* Upgrade Request */}
              {upgradeReq && (
                <div
                  className="rounded-xl p-4 border-2"
                  style={{
                    borderColor: "#053F5330",
                    backgroundColor: "#053F5308",
                  }}
                >
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Crown className="w-4 h-4" style={{ color: "#053F53" }} />
                    Upgrade Request
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Target Plan</p>
                      <PlanBadge plan={upgradeReq.targetPlan} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Billing Mode</p>
                      <p className="font-medium capitalize">
                        {upgradeReq.requestedMode}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Amount</p>
                      <p className="font-bold text-gray-900">
                        JOD {upgradeReq.requestedPrice}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Status</p>
                      <StatusBadge status={upgradeReq.status} />
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500 text-xs mb-1">Requested At</p>
                      <p className="text-gray-700">
                        {new Date(upgradeReq.requestedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Driver Info */}
              {driver && (
                <div className="border border-gray-100 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Car className="w-4 h-4" style={{ color: "#053F53" }} />
                    Driver Information
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Car Model</p>
                      <p className="font-medium">{driver.carModel}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">License Plate</p>
                      <p className="font-medium">{driver.licensePlate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">License Number</p>
                      <p className="font-medium">{driver.licenseNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Seats</p>
                      <p className="font-medium">{driver.numberOfSeats}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Languages</p>
                      <p className="font-medium">
                        {driver.languages.join(", ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Amenities</p>
                      <p className="font-medium text-xs">
                        {[
                          driver.hasAc && "AC",
                          driver.hasUsbPort && "USB",
                          driver.hasWifi && "WiFi",
                          driver.hasMusic && "Music",
                        ]
                          .filter(Boolean)
                          .join(", ") || "None"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {upgradeReq?.status === "pending" && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => onReject(userId, upgradeReq.targetPlan)}
                    disabled={isActioning}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-red-200 text-red-600 font-medium rounded-xl hover:bg-red-50 transition disabled:opacity-50"
                  >
                    {isActioning ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    Reject
                  </button>
                  <button
                    onClick={() => onApprove(userId, upgradeReq.targetPlan)}
                    disabled={isActioning}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-white font-medium rounded-xl transition hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: "#053F53" }}
                  >
                    {isActioning ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    Approve
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: string;
}) => (
  <div
    className="bg-white rounded-xl shadow-sm p-5 border-l-4 flex items-center justify-between"
    style={{ borderLeftColor: accent ?? "#053F53" }}
  >
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <h3 className="text-2xl font-bold mt-0.5 text-gray-900">{value}</h3>
    </div>
    <div
      className="p-3 rounded-full"
      style={{ backgroundColor: `${accent ?? "#053F53"}15` }}
    >
      <span style={{ color: accent ?? "#053F53" }}>{icon}</span>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Subscription = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // API hooks
  const { data: activitiesData, isLoading: activitiesLoading } =
    useGetSubscriptionActivitiesQuery();

  const { data: requestsData, isLoading: requestsLoading } =
    useGetSubscriptionRequestsQuery({ page, limit: 10 });

  const [changeStatus, { isLoading: isActioning }] =
    useChangeSubscriptionStatusMutation();

  const summary = activitiesData?.data?.summary;
  const plans = activitiesData?.data?.plans;
  const requests = requestsData?.data ?? [];
  const meta = requestsData?.meta;

  const filteredRequests = requests.filter(
    (r) =>
      r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.accountId.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleApprove = async (userId: string, plan: string) => {
    try {
      await changeStatus({
        userId,
        body: { plan, subscriptionStatus: "approved" },
      }).unwrap();
      setSelectedUserId(null);
    } catch (err) {
      console.error("Approve failed:", err);
    }
  };

  const handleReject = async (userId: string, plan: string) => {
    try {
      await changeStatus({
        userId,
        body: { plan, subscriptionStatus: "rejected" },
      }).unwrap();
      setSelectedUserId(null);
    } catch (err) {
      console.error("Reject failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Subscription Management
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Review and manage user subscription upgrade requests
        </p>
      </div>

      {/* Stats Row */}
      {activitiesLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Users"
            value={summary?.totalUsers ?? 0}
            icon={<Users className="w-5 h-5" />}
          />
          <StatCard
            label="Active Users"
            value={summary?.active ?? 0}
            icon={<CheckCircle className="w-5 h-5" />}
            accent="#059669"
          />
          <StatCard
            label="Pending Requests"
            value={summary?.pending ?? 0}
            icon={<Clock className="w-5 h-5" />}
            accent="#d97706"
          />
          <StatCard
            label="Premium+ Users"
            value={plans?.premiumPlus ?? 0}
            icon={<Crown className="w-5 h-5" />}
            accent="#7c3aed"
          />
        </div>
      )}

      {/* Plan Distribution */}
      {!activitiesLoading && plans && (
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            Plan Distribution
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(
              [
                { key: "free", label: "Free" },
                { key: "premium", label: "Premium" },
                { key: "premiumPlus", label: "Premium+" },
                { key: "allAccess", label: "All Access" },
              ] as const
            ).map(({ key, label }) => {
              const count = plans[key];
              const total = summary?.totalUsers || 1;
              const pct = Math.round((count / total) * 100);
              const cfg = getPlanConfig(
                key === "premiumPlus" ? "premium-plus" : key,
              );
              return (
                <div key={key} className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-xs text-gray-500 mb-2">{label}</p>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: cfg.color }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{pct}%</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Requests Table */}
      <div className="bg-white rounded-xl shadow-sm">
        {/* Table Header */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-gray-800">
              Subscription Requests
            </h3>
            {meta && (
              <p className="text-xs text-gray-400 mt-0.5">
                {meta.total} total request{meta.total !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, account ID..."
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent w-72"
              style={{ "--tw-ring-color": "#053F5340" } as React.CSSProperties}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          {requestsLoading ? (
            <div className="flex items-center justify-center py-20 gap-3">
              <Loader2
                className="w-6 h-6 animate-spin"
                style={{ color: "#053F53" }}
              />
              <span className="text-gray-400 text-sm">Loading requests...</span>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
              <CheckCircle className="w-10 h-10" />
              <p className="text-sm font-medium">No subscription requests</p>
              <p className="text-xs">All requests have been processed</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="text-left py-3 px-5 font-semibold">User</th>
                  <th className="text-left py-3 px-5 font-semibold">
                    Current Plan
                  </th>
                  <th className="text-left py-3 px-5 font-semibold">
                    Requested Plan
                  </th>
                  <th className="text-left py-3 px-5 font-semibold">Billing</th>
                  <th className="text-left py-3 px-5 font-semibold">Amount</th>
                  <th className="text-left py-3 px-5 font-semibold">Status</th>
                  <th className="text-left py-3 px-5 font-semibold">
                    Requested At
                  </th>
                  <th className="text-left py-3 px-5 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredRequests.map((req: SubscriptionRequest) => (
                  <tr
                    key={req._id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="py-4 px-5">
                      <div>
                        <p className="font-medium text-gray-900">
                          {req.fullName}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" />
                          {req.email}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {req.accountId}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <PlanBadge plan={req.currentPlan} />
                    </td>
                    <td className="py-4 px-5">
                      <PlanBadge plan={req.requestedPlan} />
                    </td>
                    <td className="py-4 px-5 capitalize">
                      <span className="text-gray-600">{req.requestedMode}</span>
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-semibold text-gray-900">
                        JOD {req.requestedPrice}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="py-4 px-5 text-gray-500 text-xs">
                      {new Date(req.requestedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedUserId(req.userId)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors"
                          style={{
                            backgroundColor: "#053F5315",
                          }}
                          onMouseEnter={(e) => {
                            (
                              e.currentTarget as HTMLElement
                            ).style.backgroundColor = "#053F53";
                            (e.currentTarget as HTMLElement).style.color =
                              "white";
                          }}
                          onMouseLeave={(e) => {
                            (
                              e.currentTarget as HTMLElement
                            ).style.backgroundColor = "#053F5315";
                            (e.currentTarget as HTMLElement).style.color =
                              "#9ca3af";
                          }}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {req.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleApprove(req.userId, req.requestedPlan)
                              }
                              disabled={isActioning}
                              className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-500 hover:text-white transition-colors disabled:opacity-50"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleReject(req.userId, req.requestedPlan)
                              }
                              disabled={isActioning}
                              className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Page {meta.page} of {meta.totalPages} · {meta.total} total
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(meta.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className="w-8 h-8 rounded-lg text-xs font-medium transition"
                  style={{
                    backgroundColor: page === i + 1 ? "#053F53" : "transparent",
                    color: page === i + 1 ? "white" : "#6b7280",
                    border: page === i + 1 ? "none" : "1px solid #e5e7eb",
                  }}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUserId && (
        <UserDetailModal
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          isActioning={isActioning}
        />
      )}
    </div>
  );
};

export default Subscription;
