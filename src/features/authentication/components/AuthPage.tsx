import { useState } from 'react';
import { Box, Tabs, Tab, Typography, Alert, Paper } from '@mui/material';
import { Lock } from '@mui/icons-material';
import { Login } from './Login';
import { Signup } from './Signup';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const AuthPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError(null);
    setSuccess(null);
  };

  const handleSwitchToLogin = () => {
    setTabValue(0);
    setError(null);
  };

  const handleSwitchToSignup = () => {
    setTabValue(1);
    setError(null);
    setSuccess(null);
  };

  const handleSuccess = (message: string) => {
    setSuccess(message);
    setError(null);
  };

  const handleError = (message: string) => {
    setError(message);
    setSuccess(null);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: '500px',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center',
            py: 3,
          }}
        >
          <Lock sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h4" fontWeight="bold">
            SocialPluse
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
            Connect with friends and family
          </Typography>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ m: 2, mb: 0 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ m: 2, mb: 0 }}>
            {success}
          </Alert>
        )}

        {/* Tabs */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="authentication tabs"
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            backgroundColor: '#f5f5f5',
          }}
        >
          <Tab label="Login" id="auth-tab-0" aria-controls="auth-tabpanel-0" />
          <Tab
            label="Sign Up"
            id="auth-tab-1"
            aria-controls="auth-tabpanel-1"
          />
        </Tabs>

        {/* Login Tab */}
        <TabPanel value={tabValue} index={0}>
          <Login
            onSwitchToSignup={handleSwitchToSignup}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </TabPanel>

        {/* Signup Tab */}
        <TabPanel value={tabValue} index={1}>
          <Signup
            onSwitchToLogin={handleSwitchToLogin}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default AuthPage;
