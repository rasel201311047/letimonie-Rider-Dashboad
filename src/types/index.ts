export interface Ride {
  id: string;
  driver: string;
  rider: string;
  pickupLocation: string;
  destination: string;
  status: "In Progress" | "Picking Up" | "Cancel";
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

export type DriverStatus = "pending" | "approved" | "rejected";
export type DocumentStatus = "pending" | "approved" | "rejected";
export type DocumentFileType = "image" | "pdf" | "link";
export type DocumentType =
  | "licensefront"
  | "licenseback"
  | "car"
  | "insurance"
  | "other";

export interface DriverDocument {
  id: string;
  type: DocumentType;
  name: string;
  url: string;
  uploadedAt: string; // ISO date string (YYYY-MM-DD)
  status: DocumentStatus;
  fileType: DocumentFileType;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: DriverStatus;
  submittedAt: string; // ISO date string
  documents: DriverDocument[];
  carModel: string;
  carYear: number;
  licenseNumber: string;
}
