import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
} from '@mui/material';
import { Lock, Email } from '@mui/icons-material';
import { validateEmail } from '../utils/validation';
import type { LoginFormData, LoginProps } from '../types';

export const Login = ({ onSwitchToSignup, onSuccess, onError }: LoginProps) => {
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!loginForm.email || !loginForm.password) {
      onError('Please fill in all fields');
      return;
    }

    if (!validateEmail(loginForm.email)) {
      onError('Please enter a valid email');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onSuccess('Login successful! Redirecting...');
      setLoginForm({ email: '', password: '' });
      // TODO: Implement actual login logic
    } catch (err) {
      onError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Email"
        type="email"
        name="email"
        value={loginForm.email}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
        disabled={loading}
        InputProps={{
          startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />,
        }}
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        name="password"
        value={loginForm.password}
        onChange={handleChange}
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
            onClick={onSwitchToSignup}
            sx={{ cursor: 'pointer' }}
            type="button"
          >
            Sign up
          </Link>
        </Typography>
      </Box>
    </form>
  );
};
