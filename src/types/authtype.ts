// Request type
export interface LoginRequest {
  email: string;
  password: string;
}

// Response type matching your Postman response
export interface LoginResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface sendEmailRequest {
  email: string;
}

export interface sendEmailResponse {
  statusCode: number;
  success: boolean;
  message: string;
}

export interface varifyOtpRequest {
  email: string;
  otp: string;
}
export interface varifyOtpResponse {
  statusCode: number;
  success: boolean;
  message: string;
}

export interface setPasswordRequest {
  email: string;
  newPassword: string;
}
export interface setPasswordResponse {
  statusCode: number;
  success: boolean;
  message: string;
}
