import React, { useState, useRef, KeyboardEvent, ClipboardEvent } from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';
import { Security as SecurityIcon } from '@mui/icons-material';

interface TOTPVerificationProps {
  onVerify: (code: string) => void;
  onResend?: () => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
}

const TOTPVerification: React.FC<TOTPVerificationProps> = ({
  onVerify,
  onResend,
  isLoading = false,
  title = 'Enter Verification Code',
  description = 'Enter the 6-digit code from your authenticator app',
}) => {
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((digit) => digit !== '') && newCode.join('').length === 6) {
      onVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);

    if (pastedData.length === 6) {
      const newCode = pastedData.split('');
      setCode(newCode);
      inputRefs.current[5]?.focus();
      onVerify(pastedData);
    }
  };

  const handleSubmit = () => {
    const totpCode = code.join('');
    if (totpCode.length === 6) {
      onVerify(totpCode);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto', textAlign: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <SecurityIcon sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {description}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 1,
          justifyContent: 'center',
          mb: 3,
        }}
        onPaste={handlePaste}
      >
        {code.map((digit, index) => (
          <TextField
            key={index}
            inputRef={(el) => (inputRefs.current[index] = el)}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={isLoading}
            inputProps={{
              maxLength: 1,
              style: {
                textAlign: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
              },
            }}
            sx={{
              width: 56,
              '& input': {
                padding: '16px 0',
              },
            }}
          />
        ))}
      </Box>

      <Button
        fullWidth
        variant="contained"
        onClick={handleSubmit}
        disabled={isLoading || code.join('').length !== 6}
        sx={{
          py: 1.5,
          mb: 2,
          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #5568d3 30%, #65408b 90%)',
          },
        }}
      >
        {isLoading ? 'Verifying...' : 'Verify Code'}
      </Button>

      {onResend && (
        <Button
          onClick={onResend}
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
          Didn't receive a code? Contact support
        </Button>
      )}
    </Box>
  );
};

export default TOTPVerification;
