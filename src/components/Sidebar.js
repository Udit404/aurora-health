import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MergeIcon from '@mui/icons-material/Merge';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { getCurrentUser, hasPermission, PERMISSIONS } from '../utils/rbac';

const drawerWidth = 240;

const Sidebar = ({ open }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser();

  const menuItems = [
    { 
      path: '/', 
      label: 'Dashboard', 
      icon: <DashboardIcon />, 
      permission: null 
    },
    { 
      path: '/search', 
      label: 'Patient Search', 
      icon: <SearchIcon />, 
      permission: PERMISSIONS.VIEW_PATIENT_RECORD 
    },
    { 
      path: '/merge', 
      label: 'MPI Merge', 
      icon: <MergeIcon />, 
      permission: PERMISSIONS.MPI_MERGE 
    },
    { 
      path: '/scheduling', 
      label: 'Scheduling', 
      icon: <CalendarMonthIcon />, 
      permission: PERMISSIONS.SCHEDULE_APPOINTMENT 
    },
    { 
      path: '/compliance', 
      label: 'Compliance & Audit', 
      icon: <AssessmentIcon />, 
      permission: PERMISSIONS.VIEW_AUDIT_LOGS 
    },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    !item.permission || hasPermission(currentUser.role, item.permission)
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        transition: 'width 0.3s',
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : 0,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          overflow: 'auto',
          transition: 'width 0.3s',
          position: 'relative',
          height: '100%',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', pt: 2 }}>
        <List>
          {filteredMenuItems.map((item) => (
            <ListItemButton
              key={item.path}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              aria-label={`Navigate to ${item.label}`}
              aria-current={location.pathname === item.path ? 'page' : undefined}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.main',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.contrastText' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;