import React from 'react';
import { Container, Typography, Box, TextField, Button, Card, CardContent, Grid, Chip, InputAdornment, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { mockPatients } from '../utils/mockData';
import { createAuditLog, AUDIT_ACTIONS } from '../utils/audit';
import { getCurrentUser } from '../utils/rbac';

const PatientSearch = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);
  const [hasSearched, setHasSearched] = React.useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    const results = mockPatients.filter(patient => 
      patient.demographics.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.demographics.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.primaryMRN.includes(searchTerm)
    );

    setSearchResults(results);
    setHasSearched(true);

    createAuditLog({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: 'PATIENT_SEARCH',
      resource: 'PatientSearch',
      metadata: { searchTerm, resultsCount: results.length }
    });
  };

  const handlePatientSelect = (patient) => {
    createAuditLog({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: AUDIT_ACTIONS.VIEW_PATIENT_RECORD,
      resource: 'Patient',
      resourceId: patient.id,
      patientId: patient.id,
      patientMRN: patient.primaryMRN
    });

    navigate(`/patient/${patient.id}`);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 95) return 'success';
    if (confidence >= 85) return 'warning';
    return 'error';
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Patient Search
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Search across all facilities with probabilistic matching
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Search by Name or MRN"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              aria-label="Search for patients by name or MRN"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button 
              fullWidth 
              variant="contained" 
              size="large" 
              onClick={handleSearch}
              startIcon={<SearchIcon />}
              aria-label="Execute patient search"
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>

      {hasSearched && searchResults.length === 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No patients found matching your search criteria. Please try different search terms.
        </Alert>
      )}

      {searchResults.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
            Search Results ({searchResults.length} candidates)
          </Typography>
          <Grid container spacing={2}>
            {searchResults.map((patient) => (
              <Grid item xs={12} key={patient.id}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { 
                      boxShadow: 3,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s'
                    }
                  }}
                  onClick={() => handlePatientSelect(patient)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 'Enter' && handlePatientSelect(patient)}
                  aria-label={`Open patient record for ${patient.demographics.firstName} ${patient.demographics.lastName}`}
                >
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {patient.demographics.firstName} {patient.demographics.lastName}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          DOB: {new Date(patient.demographics.dateOfBirth).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Gender: {patient.demographics.gender}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Primary MRN: <strong>{patient.primaryMRN}</strong>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                            Linked MRNs:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {patient.linkedMRNs.map((mrn, idx) => (
                              <Chip 
                                key={idx}
                                label={`${mrn.source}: ${mrn.mrn}`}
                                size="small"
                                color={mrn.status === 'active' ? 'success' : 'warning'}
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Match Confidence:
                          </Typography>
                          <Chip 
                            label={`${patient.matchConfidence}%`}
                            size="small"
                            color={getConfidenceColor(patient.matchConfidence)}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default PatientSearch;