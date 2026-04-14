export interface DashboardStats {
  totalRevenue: number;
  activeRides: number;
  activeUsers: number;
}

// Full API response wrapper
export interface DashboardStatsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: DashboardStats;
}

// graph

export interface RevenueItem {
  label: string;
  value: number;
}

export interface RevenueAnalyticsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: RevenueItem[];
}

// user groth
export interface UserGrowthItem {
  label: string;
  count: number;
}

export interface UserGrowthResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: UserGrowthItem[];
}

// user info

export interface TopOverviewResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    name: string;
    avatar: string;
    role: string;
    notificationCount: number;
  };
}

// active rider

export interface Location {
  type: string;
  coordinates: [number, number];
  address: string;
}

export interface ActiveRide {
  tripId: string;
  pickupLocation: Location;
  dropOffLocation: Location;
  tripStatus: string;
  driverName: string;
  driverAvatar: string;
}

export interface ActiveRidesResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: ActiveRide[];
}
