import type {
  LoginRequest,
  LoginResponse,
  sendEmailRequest,
  sendEmailResponse,
  setPasswordRequest,
  setPasswordResponse,
  varifyOtpRequest,
  varifyOtpResponse,
} from "../../types/authtype";
import { baseApi } from "../baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/admin/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // forgot
    // send email
    sendemail: builder.mutation<sendEmailResponse, sendEmailRequest>({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: email,
      }),
    }),

    // varify
    varifyotp: builder.mutation<varifyOtpResponse, varifyOtpRequest>({
      query: (email) => ({
        url: "/auth/verify/reset-password",
        method: "POST",
        body: email,
      }),
    }),
    // set password /auth/reset-password
    setPassword: builder.mutation<setPasswordResponse, setPasswordRequest>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSendemailMutation,
  useVarifyotpMutation,
  useSetPasswordMutation,
} = authApi;
