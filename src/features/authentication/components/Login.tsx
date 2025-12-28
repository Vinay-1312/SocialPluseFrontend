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
import { useLoginInit, useLoginVerify } from '../hooks/useAuth';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/validation';
import TOTPVerification from './TOTPVerification';
import type { LoginFormData, LoginProps } from '../types';

type LoginStep = 'form' | 'totp-verify';

export const Login = ({ onSwitchToSignup, onSuccess, onError }: LoginProps) => {
  const loginInitMutation = useLoginInit();
  const loginVerifyMutation = useLoginVerify();
  const { setAuth } = useAuth();

  const [currentStep, setCurrentStep] = useState<LoginStep>('form');
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [sessionToken, setSessionToken] = useState<string>('');

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

    loginInitMutation.mutate(
      {
        email: loginForm.email,
        password: loginForm.password,
      },
      {
        onSuccess: (data) => {
          setSessionToken(data.sessionToken);
          setCurrentStep('totp-verify');
        },
        onError: (err) => {
          onError(err.message || 'Login failed. Please check your credentials.');
        },
      }
    );
  };

  const handleTOTPVerify = (totpCode: string) => {
    loginVerifyMutation.mutate(
      {
        sessionToken,
        totpCode,
      },
      {
        onSuccess: (data) => {
          // Save user and tokens to auth context
          setAuth(
            data.user,
            {
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            }
          );

          onSuccess(data.message || 'Login successful!');

          // Reset form
          setLoginForm({ email: '', password: '' });
          setSessionToken('');
          setCurrentStep('form');
        },
        onError: (err) => {
          onError(err.message || 'TOTP verification failed. Please try again.');
        },
      }
    );
  };

  const handleBackToLogin = () => {
    setCurrentStep('form');
    setSessionToken('');
  };

  const isLoading = loginInitMutation.isPending || loginVerifyMutation.isPending;

  return (
    <Box>
      {currentStep === 'form' && (
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
            disabled={isLoading}
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
            disabled={isLoading}
            InputProps={{
              startAdornment: <Lock sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />

          <Link
            href="#"
            variant="body2"
            sx={{ display: 'block', mt: 1, mb: 2, textAlign: 'right' }}
            onClick={(e) => {
              e.preventDefault();
              onError('Password reset not yet implemented');
            }}
          >
            Forgot password?
          </Link>

          <Button
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            disabled={isLoading}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              mt: 2,
            }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Login'}
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
      )}

      {currentStep === 'totp-verify' && (
        <Box>
          <TOTPVerification
            onVerify={handleTOTPVerify}
            isLoading={isLoading}
            title="Enter Verification Code"
            description="Enter the 6-digit code from your authenticator app"
          />
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              onClick={handleBackToLogin}
              disabled={isLoading}
              sx={{
                textTransform: 'none',
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline',
                },
              }}
            >
              Back to login
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};
