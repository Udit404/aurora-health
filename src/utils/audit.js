let auditStore = [];

export const AUDIT_ACTIONS = {
  VIEW_PATIENT_RECORD: "VIEW_PATIENT_RECORD",
  VIEW_PATIENT_SUMMARY: "VIEW_PATIENT_SUMMARY",
  VIEW_PATIENT_HEADER: "VIEW_PATIENT_HEADER",
  VIEW_TIMELINE: "VIEW_TIMELINE",
  VIEW_PROVENANCE: "VIEW_PROVENANCE",
  VIEW_VERSION_HISTORY: "VIEW_VERSION_HISTORY",
  EDIT_PATIENT_DATA: "EDIT_PATIENT_DATA",
  ATTEMPTED_EDIT: "ATTEMPTED_EDIT",
  MPI_MERGE_INITIATED: "MPI_MERGE_INITIATED",
  MPI_MERGE_CONFIRMED: "MPI_MERGE_CONFIRMED",
  MPI_MERGE_COMPLETED: "MPI_MERGE_COMPLETED",
  MPI_MERGE_FAILED: "MPI_MERGE_FAILED",
  CONFLICT_RECONCILED: "CONFLICT_RECONCILED",
  FEED_STATUS_CHANGED: "FEED_STATUS_CHANGED",
  WRITE_BLOCKED_FEED_UNAVAILABLE: "WRITE_BLOCKED_FEED_UNAVAILABLE",
  ACCESS_DENIED: "ACCESS_DENIED",
  APPOINTMENT_SCHEDULED: "APPOINTMENT_SCHEDULED",
  APPOINTMENT_MODIFIED: "APPOINTMENT_MODIFIED",
  WAITLIST_JOINED: "WAITLIST_JOINED",
  WAITLIST_PROMOTED: "WAITLIST_PROMOTED",
  AUDIT_EXPORT_REQUESTED: "AUDIT_EXPORT_REQUESTED",
  AUDIT_EXPORT_DOWNLOADED: "AUDIT_EXPORT_DOWNLOADED"
};

export const AUDIT_OUTCOMES = {
  SUCCESS: "SUCCESS",
  DENIED: "DENIED",
  FAILED: "FAILED",
  BLOCKED: "BLOCKED"
};

export const createAuditLog = ({
  actor,
  actorRole,
  action,
  resource,
  resourceId,
  patientId,
  patientMRN,
  outcome = AUDIT_OUTCOMES.SUCCESS,
  reason = null,
  metadata = {},
  oldValue = null,
  newValue = null,
  provenance = null
}) => {
  const auditEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    actor: actor || "Unknown",
    actorRole: actorRole || "Unknown",
    action,
    resource,
    resourceId: resourceId || null,
    patientId: patientId || null,
    patientMRN: patientMRN || null,
    outcome,
    reason,
    metadata,
    oldValue,
    newValue,
    provenance,
    ipAddress: "192.168.1.100",
    userAgent: navigator?.userAgent || "Unknown",
    sessionId: sessionStorage.getItem("sessionId") || "session-unknown"
  };

  auditStore.push(Object.freeze(auditEntry));
  
  console.log("[AUDIT LOG]", auditEntry);
  
  return auditEntry;
};

export const queryAuditLogs = ({
  patientId = null,
  actor = null,
  action = null,
  startDate = null,
  endDate = null,
  outcome = null,
  limit = 100
} = {}) => {
  let results = [...auditStore];

  if (patientId) {
    results = results.filter(log => log.patientId === patientId);
  }

  if (actor) {
    results = results.filter(log => log.actor === actor);
  }

  if (action) {
    results = results.filter(log => log.action === action);
  }

  if (startDate) {
    results = results.filter(log => new Date(log.timestamp) >= new Date(startDate));
  }

  if (endDate) {
    results = results.filter(log => new Date(log.timestamp) <= new Date(endDate));
  }

  if (outcome) {
    results = results.filter(log => log.outcome === outcome);
  }

  results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return results.slice(0, limit);
};

export const exportAuditLogs = (filters = {}) => {
  const logs = queryAuditLogs({ ...filters, limit: 10000 });
  
  const exportData = {
    exportTimestamp: new Date().toISOString(),
    exportedBy: filters.exportedBy || "Unknown",
    filters,
    totalRecords: logs.length,
    logs,
    checksum: generateChecksum(logs)
  };

  return exportData;
};

const generateChecksum = (data) => {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `checksum-${Math.abs(hash).toString(16)}`;
};

export const getAuditStats = (patientId = null) => {
  const logs = patientId ? queryAuditLogs({ patientId, limit: 10000 }) : auditStore;
  
  return {
    totalLogs: logs.length,
    byAction: logs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {}),
    byOutcome: logs.reduce((acc, log) => {
      acc[log.outcome] = (acc[log.outcome] || 0) + 1;
      return acc;
    }, {}),
    byActor: logs.reduce((acc, log) => {
      acc[log.actor] = (acc[log.actor] || 0) + 1;
      return acc;
    }, {}),
    recentActivity: logs.slice(0, 10)
  };
};