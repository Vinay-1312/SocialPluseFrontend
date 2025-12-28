import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Download as DownloadIcon,
  ContentCopy as CopyIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

interface BackupCodesDisplayProps {
  backupCodes: string[];
  onContinue: () => void;
  isLoading?: boolean;
}

const BackupCodesDisplay: React.FC<BackupCodesDisplayProps> = ({
  backupCodes,
  onContinue,
  isLoading = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const codesText = backupCodes.join('\n');
    await navigator.clipboard.writeText(codesText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const codesText = backupCodes.join('\n');
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `socialpluse-backup-codes-${new Date().getTime()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <WarningIcon sx={{ fontSize: 40, color: 'warning.main', mr: 1 }} />
        <Typography variant="h5" component="h2">
          Save Your Backup Codes
        </Typography>
      </Box>

      <Alert severity="warning" sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
          Important: Save these backup codes now!
        </Typography>
        <Typography variant="body2">
          These codes can be used to access your account if you lose access to your
          authenticator app. Each code can only be used once.
        </Typography>
      </Alert>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
          backgroundColor: '#f5f5f5',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="subtitle2" fontWeight="bold">
            Your Backup Codes:
          </Typography>
          <Box>
            <Tooltip title={copied ? 'Copied!' : 'Copy all codes'}>
              <IconButton onClick={handleCopy} size="small" color="primary">
                <CopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download as text file">
              <IconButton onClick={handleDownload} size="small" color="primary">
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Grid container spacing={1}>
          {backupCodes.map((code, index) => (
            <Grid size={{ xs: 6 }} key={index}>
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  textAlign: 'center',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  backgroundColor: '#fff',
                }}
              >
                {code}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Box sx={{ textAlign: 'left', mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
          How to use backup codes:
        </Typography>
        <Box component="ul" sx={{ pl: 2, m: 0 }}>
          <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Store these codes in a secure location
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Use a backup code if you lose access to your authenticator app
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Each code can only be used once
          </Typography>
        </Box>
      </Box>

      <Button
        fullWidth
        variant="contained"
        onClick={onContinue}
        disabled={isLoading}
        sx={{
          py: 1.5,
          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #5568d3 30%, #65408b 90%)',
          },
        }}
      >
        {isLoading ? 'Processing...' : 'I Have Saved My Backup Codes'}
      </Button>
    </Box>
  );
};

export default BackupCodesDisplay;
