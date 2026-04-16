export type TProfileData = {
  name: string;
  avatar: string;
  role: string;
  notificationCount: number;
};

export type TProfileResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: TProfileData;
};

export type TUpdateProfileRequest = {
  fullName: string;
};

export type TUpdateProfileResponse = {
  statusCode: number;
  success: boolean;
  status: string;
  message: string;
};

export type TChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
};

export type TChangePasswordResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
};

export type TChangeProfileImageResponse = {
  statusCode: number;
  success: boolean;
  status: string;
  message: string;
  data: {
    avatar: string;
  };
};
