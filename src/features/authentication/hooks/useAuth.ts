import { useMutation } from '@tanstack/react-query';
import {
  signupInit,
  signupVerifyTOTP,
  loginInit,
  loginVerifyTOTP,
  refreshAccessToken,
  logout,
  SignupInitData,
  SignupInitResponse,
  SignupVerifyData,
  SignupVerifyResponse,
  LoginInitData,
  LoginInitResponse,
  LoginVerifyData,
  LoginVerifyResponse,
  RefreshTokenData,
  RefreshTokenResponse,
  LogoutData,
  LogoutResponse,
} from '../api/authApi';

// Signup Hooks
export const useSignupInit = () => {
  return useMutation<SignupInitResponse, Error, SignupInitData>({
    mutationFn: signupInit,
  });
};

export const useSignupVerify = () => {
  return useMutation<SignupVerifyResponse, Error, SignupVerifyData>({
    mutationFn: signupVerifyTOTP,
  });
};

// Login Hooks
export const useLoginInit = () => {
  return useMutation<LoginInitResponse, Error, LoginInitData>({
    mutationFn: loginInit,
  });
};

export const useLoginVerify = () => {
  return useMutation<LoginVerifyResponse, Error, LoginVerifyData>({
    mutationFn: loginVerifyTOTP,
  });
};

// Token Management Hooks
export const useRefreshToken = () => {
  return useMutation<RefreshTokenResponse, Error, RefreshTokenData>({
    mutationFn: refreshAccessToken,
  });
};

export const useLogout = () => {
  return useMutation<LogoutResponse, Error, LogoutData>({
    mutationFn: logout,
  });
};
