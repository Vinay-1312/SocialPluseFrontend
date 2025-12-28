import { Box, Typography, Button, Paper, Avatar } from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useAuth } from '../features/authentication/context/AuthContext';
import { useLogout } from '../features/authentication/hooks/useAuth';

const Dashboard = () => {
  const { user, tokens, clearAuth } = useAuth();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    if (!tokens?.refreshToken) {
      clearAuth();
      return;
    }

    logoutMutation.mutate(
      { refreshToken: tokens.refreshToken },
      {
        onSuccess: () => {
          clearAuth();
        },
        onError: () => {
          // Clear auth even if API call fails
          clearAuth();
        },
      }
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 600,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 2,
            bgcolor: 'primary.main',
            fontSize: '2rem',
          }}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>

        <Typography variant="h4" gutterBottom>
          Welcome, {user?.name}!
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          {user?.email}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          You are successfully logged in with 2FA authentication.
        </Typography>

        <Box
          sx={{
            p: 2,
            backgroundColor: 'grey.100',
            borderRadius: 1,
            mb: 3,
            textAlign: 'left',
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Session Info:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            User ID: {user?.id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Token: {tokens?.accessToken ? 'Active' : 'Inactive'}
          </Typography>
        </Box>

        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          sx={{ py: 1.5 }}
        >
          {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
        </Button>
      </Paper>
    </Box>
  );
};

export default Dashboard;
