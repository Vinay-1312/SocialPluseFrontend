import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
} from '@mui/material';
import { Lock, Email, Person } from '@mui/icons-material';
import { useSignup } from '../hooks/useSignup';
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
} from '../utils/validation';
import type { SignupFormData, SignupProps } from '../types';

export const Signup = ({
  onSwitchToLogin,
  onSuccess,
  onError,
}: SignupProps) => {
  const signupMutation = useSignup();

  const [signupForm, setSignupForm] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !signupForm.name ||
      !signupForm.email ||
      !signupForm.password ||
      !signupForm.confirmPassword
    ) {
      onError('Please fill in all fields');
      return;
    }

    if (!validateEmail(signupForm.email)) {
      onError('Please enter a valid email');
      return;
    }

    if (!validatePassword(signupForm.password)) {
      onError('Password must be at least 6 characters');
      return;
    }

    if (
      !validatePasswordMatch(signupForm.password, signupForm.confirmPassword)
    ) {
      onError('Passwords do not match');
      return;
    }

    signupMutation.mutate(
      {
        name: signupForm.name,
        email: signupForm.email,
        password: signupForm.password,
      },
      {
        onSuccess: (data) => {
          onSuccess(
            data.message || 'Account created successfully! Please log in.'
          );
          setSignupForm({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
          });
          onSwitchToLogin();
        },
        onError: (err) => {
          onError(err.message || 'Signup failed. Please try again.');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Full Name"
        type="text"
        name="name"
        value={signupForm.name}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
        disabled={signupMutation.isPending}
        InputProps={{
          startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />,
        }}
      />
      <TextField
        fullWidth
        label="Email"
        type="email"
        name="email"
        value={signupForm.email}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
        disabled={signupMutation.isPending}
        InputProps={{
          startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />,
        }}
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        name="password"
        value={signupForm.password}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
        disabled={signupMutation.isPending}
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
        onChange={handleChange}
        margin="normal"
        variant="outlined"
        disabled={signupMutation.isPending}
        InputProps={{
          startAdornment: <Lock sx={{ mr: 1, color: 'action.active' }} />,
        }}
      />

      <Button
        fullWidth
        variant="contained"
        size="large"
        type="submit"
        disabled={signupMutation.isPending}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          mt: 3,
        }}
      >
        {signupMutation.isPending ? (
          <CircularProgress size={24} />
        ) : (
          'Create Account'
        )}
      </Button>

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="body2">
          Already have an account?{' '}
          <Link
            component="button"
            variant="body2"
            onClick={onSwitchToLogin}
            sx={{ cursor: 'pointer' }}
            type="button"
          >
            Login
          </Link>
        </Typography>
      </Box>
    </form>
  );
};
