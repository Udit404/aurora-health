import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Paper, Chip } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import MergeIcon from '@mui/icons-material/Merge';
import SecurityIcon from '@mui/icons-material/Security';
import { mockFeedStatus } from '../utils/mockData';
import { createAuditLog, AUDIT_ACTIONS } from '../utils/audit';
import { getCurrentUser } from '../utils/rbac';

const Dashboard = () => {
  const currentUser = getCurrentUser();

  React.useEffect(() => {
    createAuditLog({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: AUDIT_ACTIONS.VIEW_PATIENT_SUMMARY,
      resource: 'Dashboard',
      resourceId: 'dashboard-main'
    });
  }, []);

  const stats = [
    { label: 'Active Patients', value: '12,847', icon: <PeopleIcon />, color: 'primary' },
    { label: 'Appointments Today', value: '156', icon: <EventIcon />, color: 'success' },
    { label: 'Pending Merges', value: '23', icon: <MergeIcon />, color: 'warning' },
    { label: 'Audit Events (24h)', value: '1,249', icon: <SecurityIcon />, color: 'info' },
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Aurora Health Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {currentUser.name}. Here's your system overview.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ color: `${stat.color}.main`, mr: 2 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              System Status
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Real-time feed status across all integrated EHR systems
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {mockFeedStatus.map((feed, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 2,
                    bgcolor: 'background.default',
                    borderRadius: 1
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {feed.source}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Last synced: {new Date(feed.lastSynced).toLocaleString()}
                    </Typography>
                  </Box>
                  <Chip 
                    label={feed.status === 'active' ? 'Active' : 'Unavailable'} 
                    color={feed.status === 'active' ? 'success' : 'error'}
                    size="small"
                    aria-label={`${feed.source} status: ${feed.status}`}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Card variant="outlined" sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Search Patients
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Find and view patient records
                  </Typography>
                </CardContent>
              </Card>
              <Card variant="outlined" sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Schedule Appointment
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Book patient appointments
                  </Typography>
                </CardContent>
              </Card>
              <Card variant="outlined" sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Review Merges
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Process pending MPI merges
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;