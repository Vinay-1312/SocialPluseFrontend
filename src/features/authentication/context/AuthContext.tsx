import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, tokens: AuthTokens) => void;
  clearAuth: () => void;
  updateTokens: (tokens: AuthTokens) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'socialpluse_access_token',
  REFRESH_TOKEN: 'socialpluse_refresh_token',
  USER: 'socialpluse_user',
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);

        if (accessToken && refreshToken && userStr) {
          setTokens({ accessToken, refreshToken });
          setUser(JSON.parse(userStr));
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthState();
  }, []);

  const setAuth = (userData: User, authTokens: AuthTokens) => {
    setUser(userData);
    setTokens(authTokens);

    // Persist to localStorage
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, authTokens.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, authTokens.refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  };

  const clearAuth = () => {
    setUser(null);
    setTokens(null);

    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  const updateTokens = (authTokens: AuthTokens) => {
    setTokens(authTokens);
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, authTokens.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, authTokens.refreshToken);
  };

  const value: AuthContextType = {
    user,
    tokens,
    isAuthenticated: !!user && !!tokens,
    isLoading,
    setAuth,
    clearAuth,
    updateTokens,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
