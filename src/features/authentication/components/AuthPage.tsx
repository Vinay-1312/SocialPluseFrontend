import { useState } from 'react';
import {
  Box,
  Container,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import { Lock, Email, Person } from '@mui/icons-material';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError(null);
    setSuccess(null);
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!loginForm.email || !loginForm.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(loginForm.email)) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess('Login successful! Redirecting...');
      setLoginForm({ email: '', password: '' });
      // TODO: Implement actual login logic
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (
      !signupForm.fullName ||
      !signupForm.email ||
      !signupForm.password ||
      !signupForm.confirmPassword
    ) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(signupForm.email)) {
      setError('Please enter a valid email');
      return;
    }

    if (signupForm.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess('Account created successfully! Please log in.');
      setSignupForm({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setTabValue(0);
      // TODO: Implement actual signup logic
    } catch (err) {
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
          <form onSubmit={handleLoginSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={loginForm.email}
              onChange={handleLoginChange}
              margin="normal"
              variant="outlined"
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <Email sx={{ mr: 1, color: 'action.active' }} />
                ),
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={loginForm.password}
              onChange={handleLoginChange}
              margin="normal"
              variant="outlined"
              disabled={loading}
              InputProps={{
                startAdornment: <Lock sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />

            <Link
              href="#"
              variant="body2"
              sx={{ display: 'block', mt: 1, mb: 2, textAlign: 'right' }}
            >
              Forgot password?
            </Link>

            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                mt: 2,
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => setTabValue(1)}
                  sx={{ cursor: 'pointer' }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </form>
        </TabPanel>

        {/* Signup Tab */}
        <TabPanel value={tabValue} index={1}>
          <form onSubmit={handleSignupSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              type="text"
              name="fullName"
              value={signupForm.fullName}
              onChange={handleSignupChange}
              margin="normal"
              variant="outlined"
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <Person sx={{ mr: 1, color: 'action.active' }} />
                ),
              }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={signupForm.email}
              onChange={handleSignupChange}
              margin="normal"
              variant="outlined"
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <Email sx={{ mr: 1, color: 'action.active' }} />
                ),
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={signupForm.password}
              onChange={handleSignupChange}
              margin="normal"
              variant="outlined"
              disabled={loading}
              helperText="Minimum 6 characters"
              InputProps={{
                startAdornment: <Lock sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={signupForm.confirmPassword}
              onChange={handleSignupChange}
              margin="normal"
              variant="outlined"
              disabled={loading}
              InputProps={{
                startAdornment: <Lock sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                mt: 3,
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Account'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => setTabValue(0)}
                  sx={{ cursor: 'pointer' }}
                >
                  Login
                </Link>
              </Typography>
            </Box>
          </form>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default AuthPage;
