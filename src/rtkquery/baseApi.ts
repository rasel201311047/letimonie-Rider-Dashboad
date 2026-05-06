import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://letty-ride-share-backend-1.onrender.com/api/v1",

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
