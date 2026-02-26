import React from 'react';
import { Container, Typography, Box, Card, CardContent, Grid, Button, Chip, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableRow, Radio, RadioGroup, FormControlLabel, LinearProgress } from '@mui/material';
import MergeIcon from '@mui/icons-material/Merge';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { mockPatients, mockFeedStatus } from '../utils/mockData';
import { createAuditLog, AUDIT_ACTIONS, AUDIT_OUTCOMES } from '../utils/audit';
import { getCurrentUser, hasPermission, PERMISSIONS } from '../utils/rbac';

const MPIMerge = () => {
  const currentUser = getCurrentUser();
  const [selectedPair, setSelectedPair] = React.useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [showConflictDialog, setShowConflictDialog] = React.useState(false);
  const [merging, setMerging] = React.useState(false);
  const [conflicts, setConflicts] = React.useState({});
  const [conflictResolutions, setConflictResolutions] = React.useState({});

  const canMerge = hasPermission(currentUser.role, PERMISSIONS.MPI_MERGE);
  const hasUnavailableFeeds = mockFeedStatus.some(feed => feed.status === 'unavailable');
  const mergeThreshold = 85;

  const candidatePairs = [
    {
      patient1: mockPatients[0],
      patient2: { ...mockPatients[0], id: 'patient-001-dup', primaryMRN: 'MRN-99999' },
      confidence: 98.5
    }
  ];

  const handleReviewPair = (pair) => {
    setSelectedPair(pair);
    
    const potentialConflicts = {
      phone: pair.patient1.demographics.phone !== pair.patient2.demographics.phone,
      email: pair.patient1.demographics.email !== pair.patient2.demographics.email
    };

    if (Object.values(potentialConflicts).some(v => v)) {
      setConflicts(potentialConflicts);
      setShowConflictDialog(true);
    } else {
      setShowConfirmDialog(true);
    }

    createAuditLog({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: AUDIT_ACTIONS.MPI_MERGE_INITIATED,
      resource: 'MPIMerge',
      patientId: pair.patient1.id,
      patientMRN: pair.patient1.primaryMRN,
      metadata: { confidence: pair.confidence }
    });
  };

  const handleConflictResolve = () => {
    const unresolvedConflicts = Object.keys(conflicts).filter(
      key => conflicts[key] && !conflictResolutions[key]
    );

    if (unresolvedConflicts.length > 0) {
      alert('Please resolve all conflicts before proceeding');
      return;
    }

    createAuditLog({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: AUDIT_ACTIONS.CONFLICT_RECONCILED,
      resource: 'MPIMerge',
      patientId: selectedPair.patient1.id,
      patientMRN: selectedPair.patient1.primaryMRN,
      metadata: { resolutions: conflictResolutions }
    });

    setShowConflictDialog(false);
    setShowConfirmDialog(true);
  };

  const handleMergeConfirm = async () => {
    setMerging(true);
    setShowConfirmDialog(false);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const success = Math.random() > 0.1;

    if (success) {
      createAuditLog({
        actor: currentUser.name,
        actorRole: currentUser.role,
        action: AUDIT_ACTIONS.MPI_MERGE_COMPLETED,
        resource: 'MPIMerge',
        patientId: selectedPair.patient1.id,
        patientMRN: selectedPair.patient1.primaryMRN,
        outcome: AUDIT_OUTCOMES.SUCCESS,
        metadata: {
          mergedMRNs: [selectedPair.patient1.primaryMRN, selectedPair.patient2.primaryMRN],
          primaryMRN: selectedPair.patient1.primaryMRN
        }
      });

      alert('Merge completed successfully!');
    } else {
      createAuditLog({
        actor: currentUser.name,
        actorRole: currentUser.role,
        action: AUDIT_ACTIONS.MPI_MERGE_FAILED,
        resource: 'MPIMerge',
        patientId: selectedPair.patient1.id,
        patientMRN: selectedPair.patient1.primaryMRN,
        outcome: AUDIT_OUTCOMES.FAILED,
        reason: 'System error during merge execution'
      });

      alert('Merge failed. Please contact support.');
    }

    setMerging(false);
    setSelectedPair(null);
    setConflicts({});
    setConflictResolutions({});
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          MPI Merge Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review and merge duplicate patient records with confidence-based matching
        </Typography>
      </Box>

      {!canMerge && (
        <Alert severity="error" sx={{ mb: 3 }}>
          You do not have permission to perform MPI merges. Contact your administrator.
        </Alert>
      )}

      {hasUnavailableFeeds && (
        <Alert severity="warning" sx={{ mb: 3 }} icon={<WarningIcon />}>
          Some external feeds are unavailable. Merge operations may be restricted for affected records.
        </Alert>
      )}

      <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
        Candidate Pairs ({candidatePairs.length})
      </Typography>

      <Grid container spacing={2}>
        {candidatePairs.map((pair, index) => (
          <Grid item xs={12} key={index}>
            <Card>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={5}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Patient 1
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {pair.patient1.demographics.firstName} {pair.patient1.demographics.lastName}
                    </Typography>
                    <Typography variant="body2">MRN: {pair.patient1.primaryMRN}</Typography>
                    <Typography variant="body2">DOB: {new Date(pair.patient1.demographics.dateOfBirth).toLocaleDateString()}</Typography>
                    <Typography variant="body2">Phone: {pair.patient1.demographics.phone}</Typography>
                  </Grid>
                  <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <MergeIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Chip 
                        label={`${pair.confidence}%`}
                        color={pair.confidence >= mergeThreshold ? 'success' : 'warning'}
                        sx={{ fontWeight: 600 }}
                      />
                      <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                        Match Confidence
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Patient 2
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {pair.patient2.demographics.firstName} {pair.patient2.demographics.lastName}
                    </Typography>
                    <Typography variant="body2">MRN: {pair.patient2.primaryMRN}</Typography>
                    <Typography variant="body2">DOB: {new Date(pair.patient2.demographics.dateOfBirth).toLocaleDateString()}</Typography>
                    <Typography variant="body2">Phone: {pair.patient2.demographics.phone}</Typography>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    startIcon={<MergeIcon />}
                    onClick={() => handleReviewPair(pair)}
                    disabled={!canMerge || pair.confidence < mergeThreshold || hasUnavailableFeeds}
                    aria-label="Review and merge patient records"
                  >
                    Review & Merge
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={showConflictDialog} onClose={() => setShowConflictDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Resolve Conflicts</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 3 }}>
            Conflicting data detected. Please select the correct value for each field.
          </Alert>
          <Table>
            <TableBody>
              {conflicts.phone && (
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                  <TableCell>
                    <RadioGroup
                      value={conflictResolutions.phone || ''}
                      onChange={(e) => setConflictResolutions({ ...conflictResolutions, phone: e.target.value })}
                    >
                      <FormControlLabel 
                        value="patient1" 
                        control={<Radio />} 
                        label={`${selectedPair?.patient1.demographics.phone} (Patient 1)`}
                      />
                      <FormControlLabel 
                        value="patient2" 
                        control={<Radio />} 
                        label={`${selectedPair?.patient2.demographics.phone} (Patient 2)`}
                      />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
              )}
              {conflicts.email && (
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell>
                    <RadioGroup
                      value={conflictResolutions.email || ''}
                      onChange={(e) => setConflictResolutions({ ...conflictResolutions, email: e.target.value })}
                    >
                      <FormControlLabel 
                        value="patient1" 
                        control={<Radio />} 
                        label={`${selectedPair?.patient1.demographics.email} (Patient 1)`}
                      />
                      <FormControlLabel 
                        value="patient2" 
                        control={<Radio />} 
                        label={`${selectedPair?.patient2.demographics.email} (Patient 2)`}
                      />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConflictDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConflictResolve}>Continue</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Merge</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            You are about to merge these patient records. This action will consolidate all data under the primary MRN.
          </Alert>
          {selectedPair && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>Primary MRN (will be retained):</Typography>
              <Chip label={selectedPair.patient1.primaryMRN} color="primary" sx={{ mb: 2 }} />
              <Typography variant="subtitle2" gutterBottom>Secondary MRN (will be linked):</Typography>
              <Chip label={selectedPair.patient2.primaryMRN} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleMergeConfirm} startIcon={<CheckCircleIcon />}>
            Confirm Merge
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={merging} aria-labelledby="merge-progress-title">
        <DialogTitle id="merge-progress-title">Merging Records...</DialogTitle>
        <DialogContent>
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress />
          </Box>
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            Please wait while we merge the patient records.
          </Typography>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default MPIMerge;