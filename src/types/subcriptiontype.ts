// ─── Subscription Types ───────────────────────────────────────────────────────

export interface SubscriptionSummary {
  totalUsers: number;
  active: number;
  pending: number;
}

export interface SubscriptionPlansCount {
  free: number;
  premium: number;
  premiumPlus: number;
  allAccess: number;
}

export interface ActivitiesData {
  summary: SubscriptionSummary;
  plans: SubscriptionPlansCount;
}

export interface GetActivitiesResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: ActivitiesData;
}

// ─── Subscription Request List ────────────────────────────────────────────────

export type SubscriptionRequestStatus = "pending" | "approved" | "rejected";

export interface SubscriptionRequest {
  _id: string;
  userId: string;
  accountId: string;
  fullName: string;
  email: string;
  phone: string;
  currentPlan: string;
  requestedPlan: string;
  requestedMode: string;
  requestedPrice: number;
  requestedAt: string;
  status: SubscriptionRequestStatus;
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetSubscriptionRequestsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: Meta;
  data: SubscriptionRequest[];
}

// ─── User Subscription Details ────────────────────────────────────────────────

export interface UpgradeRequest {
  requestedAt: string;
  requestedMode: string;
  requestedPrice: number;
  status: string;
  targetPlan: string;
}

export interface UserSubscription {
  _id: string;
  user: string;
  activatedAt: string | null;
  amountPaid: number;
  billingCycle: string | null;
  createdAt: string;
  expiryDate: string | null;
  plan: string;
  status: string;
  updatedAt: string;
  upgradeRequest: UpgradeRequest;
}

export interface DriverData {
  _id: string;
  user: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  avatar: string;
  languages: string[];
  governorate: string;
  licenseNumber: string;
  carGalleries: string[];
  verificationImage: string;
  carModel: string;
  licensePlate: string;
  vehicleType: string;
  numberOfSeats: number;
  trunkSize: string;
  avgRating: number;
  totalReviews: number;
  totalEarning: number;
  totalTripCompleted: number;
  hasAc: boolean;
  hasUsbPort: boolean;
  hasWifi: boolean;
  isSmokingAllowed: boolean;
  hasMusic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSubscriptionDetail {
  userId: string;
  fullName: string;
  email: string;
  isActive: boolean;
  subscription: UserSubscription;
  passengerData: null | object;
  driverData: DriverData | null;
}

export interface GetUserSubscriptionDetailResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: UserSubscriptionDetail;
}

// ─── Change Status ────────────────────────────────────────────────────────────

export interface ChangeStatusPayload {
  plan: string;
  subscriptionStatus: "approved" | "rejected";
  expirationDate?: string;
}

export interface ChangeStatusResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    subscription: {
      id: string;
      plan: string;
      status: string;
    };
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    avatar: string;
    accountId: string;
    badge: string;
    currentRole: string;
    isActive: boolean;
    updatedAt: string;
  };
}
