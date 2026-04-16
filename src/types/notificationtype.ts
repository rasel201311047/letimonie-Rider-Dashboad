export type NotificationAudience =
  | "all"
  | "driver"
  | "passenger"
  | "specific-user";

export interface SendNotificationPayload {
  audience: NotificationAudience;
  title: string;
  message: string;
  receiver?: string; // specific-user _id
}

export interface SendNotificationResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    title: string;
    message: string;
  };
}

export interface SearchedUser {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  accountId: string;
  createdAt: string;
}

export interface SearchUsersResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    data: SearchedUser[];
  };
}

// show notify
export interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  timeAgo: string;
}

export interface NotificationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetNotificationsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: NotificationMeta;
  data: Notification[];
}

export interface MarkAsReadResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    isRead: boolean;
  };
}

export interface UnseenCountResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    unseenCount: number;
  };
}
