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
