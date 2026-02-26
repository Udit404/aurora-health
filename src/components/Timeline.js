import React from 'react';
import { Box, Typography, Card, CardContent, Chip, TextField, MenuItem, Select, FormControl, InputLabel, Grid, Tooltip, IconButton, Alert } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import { mockEncounters } from '../utils/mockData';

const Timeline = ({ patientId }) => {
  const [encounters, setEncounters] = React.useState(mockEncounters);
  const [filterType, setFilterType] = React.useState('all');
  const [filterFacility, setFilterFacility] = React.useState('all');
  const [dateRange, setDateRange] = React.useState({ start: '', end: '' });

  const encounterTypes = ['all', ...new Set(mockEncounters.map(e => e.type))];
  const facilities = ['all', ...new Set(mockEncounters.map(e => e.facility))];

  React.useEffect(() => {
    let filtered = [...mockEncounters];

    if (filterType !== 'all') {
      filtered = filtered.filter(e => e.type === filterType);
    }

    if (filterFacility !== 'all') {
      filtered = filtered.filter(e => e.facility === filterFacility);
    }

    if (dateRange.start) {
      filtered = filtered.filter(e => new Date(e.date) >= new Date(dateRange.start));
    }

    if (dateRange.end) {
      filtered = filtered.filter(e => new Date(e.date) <= new Date(dateRange.end));
    }

    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    setEncounters(filtered);
  }, [filterType, filterFacility, dateRange]);

  const hasStaleFeeds = encounters.some(e => e.syncStatus === 'stale');

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Timeline
      </Typography>

      {hasStaleFeeds && (
        <Alert severity="warning" sx={{ mb: 3 }} role="alert" aria-live="polite">
          Some encounter data may be stale due to external feed unavailability. Last synced timestamps are shown below.
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="filter-type-label">Encounter Type</InputLabel>
              <Select
                labelId="filter-type-label"
                value={filterType}
                label="Encounter Type"
                onChange={(e) => setFilterType(e.target.value)}
                aria-label="Filter encounters by type"
              >
                {encounterTypes.map(type => (
                  <MenuItem key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="filter-facility-label">Facility</InputLabel>
              <Select
                labelId="filter-facility-label"
                value={filterFacility}
                label="Facility"
                onChange={(e) => setFilterFacility(e.target.value)}
                aria-label="Filter encounters by facility"
              >
                {facilities.map(facility => (
                  <MenuItem key={facility} value={facility}>
                    {facility === 'all' ? 'All Facilities' : facility}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              aria-label="Filter encounters from start date"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="End Date"
              InputLabelProps={{ shrink: true }}
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              aria-label="Filter encounters to end date"
            />
          </Grid>
        </Grid>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Showing {encounters.length} encounter{encounters.length !== 1 ? 's' : ''}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {encounters.map((encounter, index) => (
          <Card 
            key={encounter.id}
            sx={{ 
              borderLeft: 4,
              borderColor: encounter.syncStatus === 'stale' ? 'warning.main' : 'primary.main',
              position: 'relative'
            }}
          >
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {encounter.type}
                    </Typography>
                    {encounter.hasConflict && (
                      <Tooltip title="This encounter has conflicting data across systems">
                        <WarningIcon sx={{ ml: 1, color: 'warning.main' }} fontSize="small" />
                      </Tooltip>
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(encounter.date).toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <LocalHospitalIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {encounter.facility}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Provider: {encounter.provider}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Chief Complaint: {encounter.chiefComplaint}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                    <Chip 
                      label={encounter.status} 
                      size="small" 
                      color="success" 
                    />
                    <Chip 
                      label={encounter.source} 
                      size="small" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={encounter.syncStatus === 'active' ? 'Synced' : 'Stale'}
                      size="small"
                      color={encounter.syncStatus === 'active' ? 'success' : 'warning'}
                    />
                    <Tooltip
                      title={
                        <Box>
                          <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                            Provenance
                          </Typography>
                          <Typography variant="caption" sx={{ display: 'block' }}>
                            Source: {encounter.source}
                          </Typography>
                          <Typography variant="caption" sx={{ display: 'block' }}>
                            Source MRN: {encounter.sourceMRN}
                          </Typography>
                          <Typography variant="caption" sx={{ display: 'block' }}>
                            Last Updated: {new Date(encounter.lastUpdated).toLocaleString()}
                          </Typography>
                          <Typography variant="caption" sx={{ display: 'block' }}>
                            Last Synced: {new Date(encounter.lastSynced).toLocaleString()}
                          </Typography>
                          <Typography variant="caption" sx={{ display: 'block' }}>
                            Version: {encounter.versionId}
                          </Typography>
                          {encounter.provenance && (
                            <Typography variant="caption" sx={{ display: 'block' }}>
                              Author: {encounter.provenance.author}
                            </Typography>
                          )}
                        </Box>
                      }
                      arrow
                    >
                      <IconButton size="small" aria-label="View encounter provenance">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Timeline;