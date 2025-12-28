import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { QrCode2 as QrCodeIcon } from '@mui/icons-material';

interface QRCodeDisplayProps {
  qrCodeUrl: string;
  title?: string;
  instructions?: string[];
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  qrCodeUrl,
  title = 'Set Up Authenticator',
  instructions = [
    'Download an authenticator app (Google Authenticator, Authy, etc.)',
    'Open the app and scan this QR code',
    'Enter the 6-digit code from your app to continue',
  ],
}) => {
  return (
    <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto', textAlign: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <QrCodeIcon sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Scan the QR code below with your authenticator app
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}
      >
        <Box
          component="img"
          src={qrCodeUrl}
          alt="QR Code for 2FA setup"
          sx={{
            width: '100%',
            maxWidth: 250,
            height: 'auto',
          }}
        />
      </Paper>

      <Box sx={{ textAlign: 'left', mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
          Instructions:
        </Typography>
        <Box component="ol" sx={{ pl: 2, m: 0 }}>
          {instructions.map((instruction, index) => (
            <Typography
              key={index}
              component="li"
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              {instruction}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default QRCodeDisplay;
