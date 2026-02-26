import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center'
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 120, color: 'error.main', mb: 3 }} />
        <Typography variant="h1" component="h1" gutterBottom sx={{ fontWeight: 700, fontSize: '4rem' }}>
          404
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '500px' }}>
          The page you are looking for does not exist or has been moved. Please check the URL or return to the dashboard.
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
          aria-label="Return to dashboard"
        >
          Return to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;