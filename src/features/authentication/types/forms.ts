export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginProps {
  onSwitchToSignup: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export interface SignupProps {
  onSwitchToLogin: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}
