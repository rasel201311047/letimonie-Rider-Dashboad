// ─── Stats ────────────────────────────────────────────────────────────────────

export interface RevenueToday {
  amount: string;
  growth: string;
}

export interface StatsOverviewData {
  totalRides: number;
  upcomingRides: number;
  ongoingRides: number;
  completedRides: number;
  revenueToday: RevenueToday;
}

export interface StatsOverviewResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: StatsOverviewData;
}

// ─── Rides List ───────────────────────────────────────────────────────────────

export interface RideMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RideListItem {
  tripId: string;
  tripStatus: "completed" | "upcoming" | "ongoing" | "cancelled";
  rideId: string;
  pickUpAddress: string;
  dropOffAddress: string;
  totalSeats: number;
  totalSeatBooked: number;
  revenue: string;
  driverName: string;
  driverAvatar: string;
  driverRating: string;
  driverTotalReviews: number;
  createdAt: string;
  startedAt: string;
  completedAt: string;
  duration: string;
}

export interface RidesListResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: RideMeta;
  data: RideListItem[];
}

export interface GetRidesArgs {
  page: number;
  limit?: number;
  searchTerm?: string;
}

export interface GetRidesResult {
  meta: RideMeta;
  data: RideListItem[];
}

// ─── Ride Details ─────────────────────────────────────────────────────────────

export interface RideDriver {
  _id: string;
  fullName: string;
  avatar: string;
  avgRating: number;
  totalReviews: number;
  totalEarning: number;
  totalTripCompleted: number;
}

export interface RidePassenger {
  bookingId: string;
  passengerId: string;
  name: string;
  avatar: string;
  seatsBooked: number;
  status: string;
  pickUpAddress: string;
  dropOffAddress: string;
  totalRides: number;
  totalSpent: number;
  avgRating: string;
  totalReviews: number;
  bookedAt: string;
  amountPaid: number;
}

export interface RideDetail {
  rideId: string;
  tripId: string;
  tripStatus: string;
  pickUpAddress: string;
  dropOffAddress: string;
  departureDateTime: string;
  startedAt: string;
  completedAt: string;
  price: number;
  totalSeats: number;
  totalSeatBooked: number;
  totalDistance: string;
  revenue: string;
  driver: RideDriver;
  passengers: RidePassenger[];
}

export interface RideDetailResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: RideDetail;
}
