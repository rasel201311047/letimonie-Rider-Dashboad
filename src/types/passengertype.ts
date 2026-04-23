export interface Subscription {
  plan: "free" | "all-access" | "premium-plus" | "premium" | string;
  status: "active" | "inactive" | string;
  billingCycle: string | null;
  expiryDate: string | null;
  activatedAt: string | null;
}
export interface Passenger {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  avgRating: number;
  totalRides: number;
  totalReviews: number;
  createdAt: string;
  driverId?: string;
  accountId?: string;
  isActive: boolean;
  isOnline: boolean;
  subscription: Subscription;
}

export interface PassengerStats {
  totalPassengers: number;
  onlinePassengers: number;
  activeAccounts: number;
  inactiveAccounts: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface PassengersListResponse {
  meta: PaginationMeta;
  data: Passenger[];
}
