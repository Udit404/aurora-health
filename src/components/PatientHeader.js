import React from 'react';
import { Box, Typography, Chip, Tooltip, IconButton, Paper } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const PatientHeader = ({ patient }) => {
  if (!patient) return null;

  const getSyncStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon fontSize="small" sx={{ color: 'success.main' }} />;
      case 'stale':
        return <WarningIcon fontSize="small" sx={{ color: 'warning.main' }} />;
      default:
        return <ErrorIcon fontSize="small" sx={{ color: 'error.main' }} />;
    }
  };

  const getRiskColor = (color) => {
    const colorMap = {
      'error': 'error',
      'warning': 'warning',
      'info': 'info',
      'success': 'success'
    };
    return colorMap[color] || 'default';
  };

  return (
    <Paper 
      sx={{ 
        p: 2, 
        mb: 3,
        borderLeft: 4,
        borderColor: 'primary.main',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        bgcolor: 'background.paper'
      }}
      role="banner"
      aria-label="Patient header information"
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            {patient.demographics.firstName} {patient.demographics.lastName}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              DOB: {new Date(patient.demographics.dateOfBirth).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gender: {patient.demographics.gender}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Primary MRN: <strong>{patient.primaryMRN}</strong>
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          {patient.riskFlags && patient.riskFlags.map((flag, idx) => (
            <Tooltip 
              key={idx}
              title={
                <Box>
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    Score: {flag.score}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    Source: {flag.source}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    Last Updated: {new Date(flag.lastUpdated).toLocaleString()}
                  </Typography>
                </Box>
              }
              arrow
            >
              <Chip 
                icon={<WarningIcon />}
                label={flag.label}
                color={getRiskColor(flag.color)}
                size="small"
                aria-label={`Risk flag: ${flag.label}, score ${flag.score}`}
              />
            </Tooltip>
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
          Linked MRNs:
        </Typography>
        {patient.linkedMRNs && patient.linkedMRNs.map((mrn, idx) => (
          <Tooltip
            key={idx}
            title={
              <Box>
                <Typography variant="caption" sx={{ display: 'block' }}>
                  Source: {mrn.source}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block' }}>
                  Status: {mrn.status}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block' }}>
                  Last Synced: {new Date(mrn.lastSynced).toLocaleString()}
                </Typography>
              </Box>
            }
            arrow
          >
            <Chip
              icon={getSyncStatusIcon(mrn.status)}
              label={`${mrn.source}: ${mrn.mrn}`}
              size="small"
              variant="outlined"
              color={mrn.status === 'active' ? 'success' : 'warning'}
              aria-label={`MRN ${mrn.mrn} from ${mrn.source}, status ${mrn.status}`}
            />
          </Tooltip>
        ))}
      </Box>
    </Paper>
  );
};

export default PatientHeader;