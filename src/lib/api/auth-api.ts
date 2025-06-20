import { axiosClient } from "./config/axios-client";

export interface ApiResponse {
  error: string | null;
  data: any;
  success: boolean;
}

export const handleApiError = (error: any): ApiResponse => {
  try {
    const errorMessage = error.response?.data.message || error?.message || "An unexpected error occurred.";
    return { error: errorMessage, data: error.response?.data, success: false };
  } catch (err) {
    return { error: "An unexpected error occurred.", data: null, success: false };
  }
};

type RegisterRequest = {
  email: string;
  userName: string;
  birthday: string;
  password: string;
  confirmPassword: string;
  role: string;
};

export const register = async (request: RegisterRequest) => {
  try {
    const result = await axiosClient.post(`/api/Authentications/register`, request);
    return { error: null, data: result.data, success: true };
  } catch (error: any) {
    return handleApiError(error);
  }
};

type LoginRequest = {
  userNameOrEmail: string;
  password: string;
};

export const login = async (request: LoginRequest) => {
  try {
    const result = await axiosClient.post(`/api/Authentications/login`, request);
    return { error: null, data: result.data, success: true };
  } catch (error: any) {
    return handleApiError(error);
  }
};

type GoogleLoginRequest = {
  idToken: string;
  birthday: string;
  role: string;
};

export const googleLogin = async (request: GoogleLoginRequest) => {
  try {
    const result = await axiosClient.post(`/api/authentications/google-login`, request);
    return { error: null, data: result.data, success: true };
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const prepareRegisterData = (formValues: any) => {
  return {
    email: formValues.email,
    userName: formValues.userName,
    birthday: formValues.birthday?.format("YYYY-MM-DD") || formValues.birthday,
    password: formValues.password,
    confirmPassword: formValues.confirmPassword || formValues["Repeat password"],
    role: formValues.Role || formValues.role || "Player",
  };
};

export const prepareGoogleLoginData = (idToken: string, formValues: any) => {
  return {
    idToken: idToken,
    birthday: formValues.birthday?.format("YYYY-MM-DD") || formValues.birthday,
    role: formValues.Role || formValues.role || "Player",
  };
};

export const getUserInfo = async () => {
  try {
    const result = await axiosClient.get(`/api/authentications/current-user`);
    return { error: null, data: result.data, success: true };
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const verifyEmail = async (token: string, userId: string) => {
  try {
    const result = await axiosClient.get(`/api/authentications/email-confirm?token=${token}&userId=${userId}`);
    return { error: null, data: result.data, success: true };
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const resendVerificationemail = async (email: string) => {
  try {
    const result = await axiosClient.post(`/api/authentications/resend-confirmation`, {
      email: email,
    });
    return { error: null, data: result.data, success: true };
  } catch (error: any) {
    return handleApiError(error);
  }
};
type CheckFirstRequest = {
  idToken: string;
};

export const checkFirstLogin = async (request: CheckFirstRequest) => {
  try {
    const result = await axiosClient.post(`/api/authentications/google-login/check-first`, request);
    return { error: null, data: result.data, success: true };
  } catch (error: any) {
    return handleApiError(error);
  }
};

export const prepareCheckFirstData = (idToken: string) => {
  return {
    idToken: idToken,
  };
};