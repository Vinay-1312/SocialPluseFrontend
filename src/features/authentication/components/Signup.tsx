import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { Lock, Email, Person } from '@mui/icons-material';
import { useSignupInit, useSignupVerify } from '../hooks/useAuth';
import { useAuth } from '../context/AuthContext';
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
} from '../utils/validation';
import QRCodeDisplay from './QRCodeDisplay';
import BackupCodesDisplay from './BackupCodesDisplay';
import TOTPVerification from './TOTPVerification';
import type { SignupFormData, SignupProps } from '../types';

type SignupStep = 'form' | 'qr-and-backup' | 'totp-verify';

export const Signup = ({
  onSwitchToLogin,
  onSuccess,
  onError,
}: SignupProps) => {
  const signupInitMutation = useSignupInit();
  const signupVerifyMutation = useSignupVerify();
  const { setAuth } = useAuth();

  const [currentStep, setCurrentStep] = useState<SignupStep>('form');
  const [signupForm, setSignupForm] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [signupData, setSignupData] = useState<{
    userId: number;
    qrCodeUrl: string;
    backupCodes: string[];
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
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

    signupInitMutation.mutate(
      {
        name: signupForm.name,
        email: signupForm.email,
        password: signupForm.password,
      },
      {
        onSuccess: (data) => {
          setSignupData({
            userId: data.userId,
            qrCodeUrl: data.totp.qrCode,
            backupCodes: data.totp.backupCodes,
          });
          setCurrentStep('qr-and-backup');
        },
        onError: (err) => {
          onError(err.message || 'Signup failed. Please try again.');
        },
      }
    );
  };

  const handleBackupCodesContinue = () => {
    setCurrentStep('totp-verify');
  };

  const handleTOTPVerify = (totpCode: string) => {
    if (!signupData) return;

    signupVerifyMutation.mutate(
      {
        userId: signupData.userId,
        totpCode,
      },
      {
        onSuccess: (data) => {
          // Save user and tokens to auth context
          setAuth(data.user, {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          });

          onSuccess(data.message || 'Account created successfully!');

          // Reset form
          setSignupForm({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
          });
          setSignupData(null);
          setCurrentStep('form');
        },
        onError: (err) => {
          onError(err.message || 'TOTP verification failed. Please try again.');
        },
      }
    );
  };

  const getActiveStep = () => {
    switch (currentStep) {
      case 'form':
        return 0;
      case 'qr-and-backup':
        return 1;
      case 'totp-verify':
        return 2;
      default:
        return 0;
    }
  };

  const isLoading =
    signupInitMutation.isPending || signupVerifyMutation.isPending;

  return (
    <Box>
      <Stepper activeStep={getActiveStep()} sx={{ mb: 4 }}>
        <Step>
          <StepLabel>Account Details</StepLabel>
        </Step>
        <Step>
          <StepLabel>Setup 2FA</StepLabel>
        </Step>
        <Step>
          <StepLabel>Verify</StepLabel>
        </Step>
      </Stepper>

      {currentStep === 'form' && (
        <form onSubmit={handleSubmitForm}>
          <TextField
            fullWidth
            label="Full Name"
            type="text"
            name="name"
            value={signupForm.name}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            disabled={isLoading}
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
            value={signupForm.password}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            disabled={isLoading}
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
            disabled={isLoading}
            InputProps={{
              startAdornment: <Lock sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            disabled={isLoading}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              mt: 3,
            }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Create Account'}
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
      )}

      {currentStep === 'qr-and-backup' && signupData && (
        <Box>
          <QRCodeDisplay qrCodeUrl={signupData.qrCodeUrl} />
          <Box sx={{ mt: 4 }}>
            <BackupCodesDisplay
              backupCodes={signupData.backupCodes}
              onContinue={handleBackupCodesContinue}
              isLoading={isLoading}
            />
          </Box>
        </Box>
      )}

      {currentStep === 'totp-verify' && (
        <TOTPVerification
          onVerify={handleTOTPVerify}
          isLoading={isLoading}
          title="Verify Your Authenticator"
          description="Enter the 6-digit code from your authenticator app to complete signup"
        />
      )}
    </Box>
  );
};
