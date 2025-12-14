import { useMutation } from '@tanstack/react-query';
import { signupUser, SignupData, SignupResponse } from '../api/authApi';

export const useSignup = () => {
  return useMutation<SignupResponse, Error, SignupData>({
    mutationFn: signupUser,
  });
};
