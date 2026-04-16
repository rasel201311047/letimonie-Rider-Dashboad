import type {
  TProfileResponse,
  TUpdateProfileRequest,
  TUpdateProfileResponse,
  TChangePasswordRequest,
  TChangePasswordResponse,
  TChangeProfileImageResponse,
} from "../../types/profiletype";
import { baseApi } from "../baseApi";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /admin/overview/top  →  fetch profile info
    getProfile: builder.query<TProfileResponse, void>({
      query: () => ({
        url: "/admin/overview/top",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),

    // PATCH /admin/update-profile  →  update name
    updateProfile: builder.mutation<
      TUpdateProfileResponse,
      TUpdateProfileRequest
    >({
      query: (body) => ({
        url: "/admin/update-profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),

    // PATCH /auth/change-password  →  change password
    changePassword: builder.mutation<
      TChangePasswordResponse,
      TChangePasswordRequest
    >({
      query: (body) => ({
        url: "/auth/change-password",
        method: "PATCH",
        body,
      }),
    }),

    // PATCH /admin/change-profile-image  →  upload avatar (form-data)
    changeProfileImage: builder.mutation<TChangeProfileImageResponse, FormData>(
      {
        query: (formData) => ({
          url: "/admin/change-profile-image",
          method: "PATCH",
          body: formData,
        }),
        invalidatesTags: ["Profile"],
      },
    ),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useChangeProfileImageMutation,
} = profileApi;
