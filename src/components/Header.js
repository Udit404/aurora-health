import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Chip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { getCurrentUser } from '../utils/rbac';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const currentUser = getCurrentUser();

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          sx={{ mr: 2 }}
          aria-label="Toggle sidebar navigation"
        >
          <MenuIcon />
        </IconButton>
        <LocalHospitalIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Aurora Health Platform
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip 
            label={currentUser.role} 
            size="small" 
            color="primary" 
            variant="outlined"
            aria-label={`Current user role: ${currentUser.role}`}
          />
          <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
            {currentUser.name}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;