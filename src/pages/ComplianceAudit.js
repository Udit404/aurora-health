import React from 'react';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, Grid, Chip, MenuItem, Alert } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import SecurityIcon from '@mui/icons-material/Security';
import { queryAuditLogs, exportAuditLogs, getAuditStats, AUDIT_ACTIONS, AUDIT_OUTCOMES } from '../utils/audit';
import { getCurrentUser, hasPermission, PERMISSIONS } from '../utils/rbac';

const ComplianceAudit = () => {
  const currentUser = getCurrentUser();
  const [logs, setLogs] = React.useState([]);
  const [filters, setFilters] = React.useState({
    actor: '',
    action: 'all',
    outcome: 'all',
    startDate: '',
    endDate: ''
  });
  const [stats, setStats] = React.useState(null);

  const canViewAudit = hasPermission(currentUser.role, PERMISSIONS.VIEW_AUDIT_LOGS);
  const canExportAudit = hasPermission(currentUser.role, PERMISSIONS.EXPORT_AUDIT_LOGS);

  React.useEffect(() => {
    if (canViewAudit) {
      loadAuditLogs();
      setStats(getAuditStats());
    }
  }, [canViewAudit]);

  const loadAuditLogs = () => {
    const queryFilters = {
      actor: filters.actor || null,
      action: filters.action !== 'all' ? filters.action : null,
      outcome: filters.outcome !== 'all' ? filters.outcome : null,
      startDate: filters.startDate || null,
      endDate: filters.endDate || null,
      limit: 100
    };

    const results = queryAuditLogs(queryFilters);
    setLogs(results);
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleSearch = () => {
    loadAuditLogs();
  };

  const handleExport = () => {
    const exportData = exportAuditLogs({
      ...filters,
      exportedBy: currentUser.name
    });

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-export-${new Date().toISOString()}.json`;
    link.click();

    alert('Audit export downloaded. Export action has been logged.');
  };

  if (!canViewAudit) {
    return (
      <Container maxWidth="xl">
        <Alert severity="error">
          You do not have permission to view audit logs. Contact your administrator.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Compliance & Audit Logs
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Immutable, tamper-evident audit trail for all system activities
        </Typography>
      </Box>

      {stats && (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {stats.totalLogs}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Audit Events
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                {stats.byOutcome[AUDIT_OUTCOMES.SUCCESS] || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Successful Actions
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main' }}>
                {stats.byOutcome[AUDIT_OUTCOMES.DENIED] || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Denied Attempts
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {stats.byOutcome[AUDIT_OUTCOMES.FAILED] || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Failed Actions
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Filter Audit Logs
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Actor"
              value={filters.actor}
              onChange={(e) => handleFilterChange('actor', e.target.value)}
              aria-label="Filter by actor name"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              select
              label="Action"
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
              aria-label="Filter by action type"
            >
              <MenuItem value="all">All Actions</MenuItem>
              {Object.values(AUDIT_ACTIONS).map(action => (
                <MenuItem key={action} value={action}>{action}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              size="small"
              select
              label="Outcome"
              value={filters.outcome}
              onChange={(e) => handleFilterChange('outcome', e.target.value)}
              aria-label="Filter by outcome"
            >
              <MenuItem value="all">All Outcomes</MenuItem>
              {Object.values(AUDIT_OUTCOMES).map(outcome => (
                <MenuItem key={outcome} value={outcome}>{outcome}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              aria-label="Filter from start date"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="End Date"
              InputLabelProps={{ shrink: true }}
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              aria-label="Filter to end date"
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
          {canExportAudit && (
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExport}>
              Export
            </Button>
          )}
        </Box>
      </Paper>

      <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
        Audit Events ({logs.length})
      </Typography>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Actor</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Resource</TableCell>
              <TableCell>Patient MRN</TableCell>
              <TableCell>Outcome</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                <TableCell>{log.actor}</TableCell>
                <TableCell>
                  <Chip label={log.actorRole} size="small" variant="outlined" />
                </TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.resource}</TableCell>
                <TableCell>{log.patientMRN || 'N/A'}</TableCell>
                <TableCell>
                  <Chip 
                    label={log.outcome} 
                    size="small" 
                    color={
                      log.outcome === AUDIT_OUTCOMES.SUCCESS ? 'success' :
                      log.outcome === AUDIT_OUTCOMES.DENIED ? 'error' :
                      log.outcome === AUDIT_OUTCOMES.FAILED ? 'warning' : 'default'
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ComplianceAudit;