import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Button, TextField, MenuItem, Chip, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { mockAppointmentSlots } from '../utils/mockData';
import { createAuditLog, AUDIT_ACTIONS } from '../utils/audit';
import { getCurrentUser } from '../utils/rbac';

const Scheduling = () => {
  const currentUser = getCurrentUser();
  const [specialty, setSpecialty] = React.useState('Internal Medicine');
  const [visitType, setVisitType] = React.useState('all');
  const [selectedSlot, setSelectedSlot] = React.useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [booking, setBooking] = React.useState(false);

  const specialties = ['Internal Medicine', 'Cardiology', 'Endocrinology', 'Orthopedics'];
  const visitTypes = ['all', 'In-Person', 'Telehealth'];

  const filteredSlots = mockAppointmentSlots.filter(slot => {
    if (visitType !== 'all' && slot.type !== visitType) return false;
    if (slot.specialty !== specialty) return false;
    return true;
  });

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setShowConfirmDialog(true);

    createAuditLog({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: 'APPOINTMENT_SLOT_SELECTED',
      resource: 'Scheduling',
      metadata: { slotId: slot.id, datetime: slot.datetime }
    });
  };

  const handleBookingConfirm = async () => {
    setBooking(true);
    setShowConfirmDialog(false);

    await new Promise(resolve => setTimeout(resolve, 1500));

    createAuditLog({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: AUDIT_ACTIONS.APPOINTMENT_SCHEDULED,
      resource: 'Appointment',
      resourceId: selectedSlot.id,
      metadata: {
        datetime: selectedSlot.datetime,
        provider: selectedSlot.provider,
        facility: selectedSlot.facility,
        type: selectedSlot.type
      }
    });

    alert('Appointment booked successfully! Confirmation sent to patient.');
    setBooking(false);
    setSelectedSlot(null);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Smart Appointment Scheduling
        </Typography>
        <Typography variant="body1" color="text.secondary">
          AI-powered scheduling with real-time multi-site availability
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            select
            label="Specialty"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            aria-label="Select medical specialty"
          >
            {specialties.map((spec) => (
              <MenuItem key={spec} value={spec}>
                {spec}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            select
            label="Visit Type"
            value={visitType}
            onChange={(e) => setVisitType(e.target.value)}
            aria-label="Select visit type"
          >
            {visitTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type === 'all' ? 'All Types' : type}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Alert severity="info" sx={{ mb: 3 }}>
        Showing earliest clinically appropriate appointments based on patient priority and availability.
      </Alert>

      <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
        Available Appointments ({filteredSlots.length})
      </Typography>

      <Grid container spacing={2}>
        {filteredSlots.map((slot) => (
          <Grid item xs={12} md={6} key={slot.id}>
            <Card 
              sx={{ 
                height: '100%',
                border: 2,
                borderColor: slot.priority === 1 ? 'primary.main' : 'divider',
                '&:hover': { boxShadow: 3 }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {new Date(slot.datetime).toLocaleDateString()}
                    </Typography>
                    <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
                      {new Date(slot.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>
                  {slot.priority === 1 && (
                    <Chip label="Recommended" color="primary" size="small" />
                  )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CalendarMonthIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {slot.provider}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  {slot.type === 'Telehealth' ? (
                    <VideoCallIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  ) : (
                    <LocationOnIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  )}
                  <Typography variant="body2">
                    {slot.facility} ({slot.type})
                  </Typography>
                </Box>

                {slot.type === 'In-Person' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocationOnIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {slot.distance}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <AccessTimeIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    Est. wait: {slot.waitTime}
                  </Typography>
                </Box>

                <Alert severity="info" sx={{ mb: 2, py: 0 }}>
                  <Typography variant="caption">
                    {slot.rationale}
                  </Typography>
                </Alert>

                <Button
                  fullWidth
                  variant={slot.priority === 1 ? 'contained' : 'outlined'}
                  onClick={() => handleSlotSelect(slot)}
                  disabled={!slot.available}
                  aria-label={`Book appointment on ${new Date(slot.datetime).toLocaleString()}`}
                >
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Appointment</DialogTitle>
        <DialogContent>
          {selectedSlot && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>Appointment Details:</Typography>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="body2"><strong>Date & Time:</strong> {new Date(selectedSlot.datetime).toLocaleString()}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}><strong>Provider:</strong> {selectedSlot.provider}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}><strong>Facility:</strong> {selectedSlot.facility}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}><strong>Type:</strong> {selectedSlot.type}</Typography>
              </Box>
              <Alert severity="info" sx={{ mt: 2 }}>
                A confirmation will be sent via SMS/email per patient preferences.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleBookingConfirm} disabled={booking}>
            {booking ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Scheduling;