import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { refreshAccessToken } from '../api/authApi';

const TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes (assuming 15min token expiry)

export const useTokenRefresh = () => {
  const { tokens, updateTokens, clearAuth, isAuthenticated } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !tokens?.refreshToken) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const refresh = async () => {
      try {
        const newTokens = await refreshAccessToken({
          refreshToken: tokens.refreshToken,
        });
        updateTokens(newTokens);
      } catch (error) {
        console.error('Token refresh failed:', error);
        clearAuth();
      }
    };

    // Set up periodic token refresh
    intervalRef.current = setInterval(refresh, TOKEN_REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAuthenticated, tokens, updateTokens, clearAuth]);
};
