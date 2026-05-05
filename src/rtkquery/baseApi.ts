import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,

    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Passenger",
    "Ride",
    "Drivers",
    "DriverStats",
    "DriverDetails",
    "Subscription",
    "Reports",
    "Profile",
    "Notification",
  ],
  refetchOnFocus: true, // ✅
  refetchOnReconnect: true, // ✅
  endpoints: () => ({}),
});
