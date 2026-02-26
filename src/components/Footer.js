import React from 'react';
import { Box, Container, Typography, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 3,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Aurora Health Platform. HIPAA Compliant. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip 
              icon={<CheckCircleIcon />} 
              label="System Operational" 
              size="small" 
              color="success" 
              variant="outlined"
              aria-label="System status: operational"
            />
            <Typography variant="caption" color="text.secondary">
              FHIR R4 Compliant
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;