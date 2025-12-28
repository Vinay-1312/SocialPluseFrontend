import { Box, CircularProgress } from '@mui/material';
import { AuthPage } from './features/authentication';
import { useAuth } from './features/authentication/context/AuthContext';
import { useTokenRefresh } from './features/authentication/hooks/useTokenRefresh';
import Dashboard from './components/Dashboard';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  // Automatically refresh tokens
  useTokenRefresh();

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    );
  }

  return isAuthenticated ? <Dashboard /> : <AuthPage />;
}

export default App;
