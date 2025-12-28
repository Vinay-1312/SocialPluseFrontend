const API_BASE_URL = 'http://localhost:3000';

// ==================== TYPE DEFINITIONS ====================

// Signup Types
export interface SignupInitData {
  name: string;
  email: string;
  password: string;
}

export interface SignupInitResponse {
  userId: number;
  email: string;
  totp: {
    qrCode: string;
    secret: string;
    backupCodes: string[];
  };
}

export interface SignupVerifyData {
  userId: number;
  totpCode: string;
}

export interface SignupVerifyResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  accessToken: string;
  refreshToken: string;
}

// Login Types
export interface LoginInitData {
  email: string;
  password: string;
}

export interface LoginInitResponse {
  message: string;
  sessionToken: string;
}

export interface LoginVerifyData {
  sessionToken: string;
  totpCode: string;
}

export interface LoginVerifyResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  accessToken: string;
  refreshToken: string;
}

// Token Management Types
export interface RefreshTokenData {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LogoutData {
  refreshToken: string;
}

export interface LogoutResponse {
  message: string;
}

// ==================== SIGNUP API ====================

export const signupInit = async (
  data: SignupInitData
): Promise<SignupInitResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/signup/init`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An error occurred during signup initialization',
    }));
    throw new Error(error.message || 'Signup initialization failed');
  }

  return response.json();
};

export const signupVerifyTOTP = async (
  data: SignupVerifyData
): Promise<SignupVerifyResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/signup/verify-totp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An error occurred during TOTP verification',
    }));
    throw new Error(error.message || 'TOTP verification failed');
  }

  return response.json();
};

// ==================== LOGIN API ====================

export const loginInit = async (
  data: LoginInitData
): Promise<LoginInitResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login/init`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An error occurred during login',
    }));
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
};

export const loginVerifyTOTP = async (
  data: LoginVerifyData
): Promise<LoginVerifyResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login/verify-totp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An error occurred during TOTP verification',
    }));
    throw new Error(error.message || 'TOTP verification failed');
  }

  return response.json();
};

// ==================== TOKEN MANAGEMENT API ====================

export const refreshAccessToken = async (
  data: RefreshTokenData
): Promise<RefreshTokenResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An error occurred during token refresh',
    }));
    throw new Error(error.message || 'Token refresh failed');
  }

  return response.json();
};

export const logout = async (data: LogoutData): Promise<LogoutResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An error occurred during logout',
    }));
    throw new Error(error.message || 'Logout failed');
  }

  return response.json();
};
