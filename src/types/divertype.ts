export interface Subscription {
  plan: "free" | "all-access" | "premium-plus" | "premium" | string;
  status: "active" | "inactive" | string;
  billingCycle: string | null;
  expiryDate: string | null;
  activatedAt: string | null;
}
export type DriverStatus = "Active" | "Blocked" | "Pending";
export type VerificationStatus = "Verified" | "Unverified" | "Rejected";

/** Raw driver item returned by GET /admin/drivers */
export interface DriverListItem {
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  avgRating: number;
  totalReviews: number;
  totalEarning: number;
  totalTripCompleted: number;
  createdAt: string;
  driverId: string;
  accountId: string;
  /** true → Active | false → Blocked | null → Pending */
  isActive: boolean | null;
  isOnline: boolean;
  userId: string;

  subscription: Subscription;
}

export interface DriverListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetDriversResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: DriverListMeta;
  data: DriverListItem[];
}

export interface GetDriversQueryArgs {
  page: number;
  limit?: number;
  searchTerm?: string;
}

// ─── Driver Details (GET /admin/drivers/details/:driverId) ──────────────────

export interface DriverDetails {
  carImages: string[];
  verificationImage: string;
  carModel: string;
  licensePlate: string;
  vehicleType: string;
  languages: string[];
  governorate: string;
  licenseNumber: string;
}

export interface GetDriverDetailsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: DriverDetails;
}

// ─── Change Status (PATCH /admin/drivers/change-status/:userId) ─────────────

export interface ChangeStatusBody {
  status: boolean;
  reason: string;
}

export interface ChangeStatusResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    isActive: boolean;
  };
}

export interface ChangeStatusArgs {
  userId: string;
  status: ChangeStatusBody;
}

// ─── Driver Stats (GET /admin/drivers/stats) ────────────────────────────────

export interface DriverStats {
  totalDrivers: number;
  onlineDrivers: number;
  activeAccounts: number;
  inactiveAccounts: number;
}

export interface GetDriverStatsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: DriverStats;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Maps `isActive` (boolean | null) → human-readable DriverStatus.
 *   true  → "Active"
 *   false → "Blocked"
 *   null  → "Pending"
 */
export function toDriverStatus(isActive: boolean | null): DriverStatus {
  if (isActive === true) return "Active";
  if (isActive === false) return "Blocked";
  return "Pending";
}
