import React from 'react';
import { Container, Box, Alert, Tabs, Tab } from '@mui/material';
import { useParams } from 'react-router-dom';
import WarningIcon from '@mui/icons-material/Warning';
import PatientHeader from '../components/PatientHeader';
import PatientSummary from '../components/PatientSummary';
import Timeline from '../components/Timeline';
import { mockPatients, mockFeedStatus } from '../utils/mockData';
import { createAuditLog, AUDIT_ACTIONS } from '../utils/audit';
import { getCurrentUser } from '../utils/rbac';

const PatientRecord = () => {
  const { id } = useParams();
  const currentUser = getCurrentUser();
  const [currentTab, setCurrentTab] = React.useState(0);
  const patient = mockPatients.find(p => p.id === id);

  const unavailableFeeds = mockFeedStatus.filter(feed => feed.status === 'unavailable');

  React.useEffect(() => {
    if (patient) {
      createAuditLog({
        actor: currentUser.name,
        actorRole: currentUser.role,
        action: AUDIT_ACTIONS.VIEW_PATIENT_RECORD,
        resource: 'PatientRecord',
        resourceId: patient.id,
        patientId: patient.id,
        patientMRN: patient.primaryMRN
      });
    }
  }, [patient, currentUser]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    
    const actions = {
      0: AUDIT_ACTIONS.VIEW_PATIENT_SUMMARY,
      1: AUDIT_ACTIONS.VIEW_TIMELINE
    };

    if (actions[newValue] && patient) {
      createAuditLog({
        actor: currentUser.name,
        actorRole: currentUser.role,
        action: actions[newValue],
        resource: newValue === 0 ? 'PatientSummary' : 'Timeline',
        resourceId: patient.id,
        patientId: patient.id,
        patientMRN: patient.primaryMRN
      });
    }
  };

  if (!patient) {
    return (
      <Container maxWidth="xl">
        <Alert severity="error">Patient not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      {unavailableFeeds.length > 0 && (
        <Alert 
          severity="warning" 
          icon={<WarningIcon />}
          sx={{ mb: 3 }}
          role="alert"
          aria-live="assertive"
        >
          <strong>Read-Only Mode:</strong> The following systems are currently unavailable: {unavailableFeeds.map(f => f.source).join(', ')}. 
          Data may be stale. Last synced: {unavailableFeeds.map(f => `${f.source} (${new Date(f.lastSynced).toLocaleString()})`).join(', ')}.
          {unavailableFeeds[0]?.outageReason && ` Reason: ${unavailableFeeds[0].outageReason}`}
        </Alert>
      )}

      <PatientHeader patient={patient} />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          aria-label="Patient record tabs"
        >
          <Tab label="Summary" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Timeline" id="tab-1" aria-controls="tabpanel-1" />
        </Tabs>
      </Box>

      <Box role="tabpanel" hidden={currentTab !== 0} id="tabpanel-0" aria-labelledby="tab-0">
        {currentTab === 0 && <PatientSummary patientId={patient.id} />}
      </Box>

      <Box role="tabpanel" hidden={currentTab !== 1} id="tabpanel-1" aria-labelledby="tab-1">
        {currentTab === 1 && <Timeline patientId={patient.id} />}
      </Box>
    </Container>
  );
};

export default PatientRecord;