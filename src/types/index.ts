export interface Ride {
  id: string;
  driver: string;
  rider: string;
  pickupLocation: string;
  destination: string;
  status: "In Progress" | "Picking Up";
  fare: string;
  duration: string;
}

export interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  icon?: string;
  color?: string;
  change?: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path: string;
  active?: boolean;
  children?: NavItem[];
}

export interface ChartData {
  month: string;
  value: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "driver" | "rider" | "admin";
  status: "active" | "inactive";
}

export interface FinancialData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}
