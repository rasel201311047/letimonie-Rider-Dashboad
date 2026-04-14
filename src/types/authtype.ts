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
