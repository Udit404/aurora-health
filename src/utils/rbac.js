export const ROLES = {
  CLINICIAN: "CLINICIAN",
  CARE_COORDINATOR: "CARE_COORDINATOR",
  SCHEDULER: "SCHEDULER",
  COMPLIANCE_OFFICER: "COMPLIANCE_OFFICER",
  ADMINISTRATOR: "ADMINISTRATOR",
  PATIENT: "PATIENT"
};

export const PERMISSIONS = {
  VIEW_PATIENT_RECORD: "VIEW_PATIENT_RECORD",
  VIEW_PATIENT_SUMMARY: "VIEW_PATIENT_SUMMARY",
  VIEW_TIMELINE: "VIEW_TIMELINE",
  VIEW_PROVENANCE: "VIEW_PROVENANCE",
  EDIT_PATIENT_DATA: "EDIT_PATIENT_DATA",
  MPI_MERGE: "MPI_MERGE",
  VIEW_AUDIT_LOGS: "VIEW_AUDIT_LOGS",
  EXPORT_AUDIT_LOGS: "EXPORT_AUDIT_LOGS",
  SCHEDULE_APPOINTMENT: "SCHEDULE_APPOINTMENT",
  OVERRIDE_BOOKING: "OVERRIDE_BOOKING",
  MANAGE_WAITLIST: "MANAGE_WAITLIST"
};

export const ROLE_PERMISSIONS = {
  [ROLES.CLINICIAN]: [
    PERMISSIONS.VIEW_PATIENT_RECORD,
    PERMISSIONS.VIEW_PATIENT_SUMMARY,
    PERMISSIONS.VIEW_TIMELINE,
    PERMISSIONS.VIEW_PROVENANCE,
    PERMISSIONS.EDIT_PATIENT_DATA,
    PERMISSIONS.SCHEDULE_APPOINTMENT
  ],
  [ROLES.CARE_COORDINATOR]: [
    PERMISSIONS.VIEW_PATIENT_RECORD,
    PERMISSIONS.VIEW_PATIENT_SUMMARY,
    PERMISSIONS.VIEW_TIMELINE,
    PERMISSIONS.VIEW_PROVENANCE,
    PERMISSIONS.MPI_MERGE,
    PERMISSIONS.SCHEDULE_APPOINTMENT,
    PERMISSIONS.MANAGE_WAITLIST
  ],
  [ROLES.SCHEDULER]: [
    PERMISSIONS.VIEW_PATIENT_SUMMARY,
    PERMISSIONS.SCHEDULE_APPOINTMENT,
    PERMISSIONS.MANAGE_WAITLIST
  ],
  [ROLES.COMPLIANCE_OFFICER]: [
    PERMISSIONS.VIEW_PATIENT_RECORD,
    PERMISSIONS.VIEW_PROVENANCE,
    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.EXPORT_AUDIT_LOGS
  ],
  [ROLES.ADMINISTRATOR]: Object.values(PERMISSIONS),
  [ROLES.PATIENT]: [
    PERMISSIONS.VIEW_PATIENT_SUMMARY,
    PERMISSIONS.SCHEDULE_APPOINTMENT
  ]
};

export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission);
};

export const hasAnyPermission = (userRole, permissionList) => {
  if (!userRole || !permissionList || !Array.isArray(permissionList)) return false;
  return permissionList.some(permission => hasPermission(userRole, permission));
};

export const hasAllPermissions = (userRole, permissionList) => {
  if (!userRole || !permissionList || !Array.isArray(permissionList)) return false;
  return permissionList.every(permission => hasPermission(userRole, permission));
};

export const getCurrentUser = () => {
  return {
    id: "user-001",
    name: "Dr. Sarah Smith",
    role: ROLES.CLINICIAN,
    email: "dr.smith@hospital.com"
  };
};

export const canAccessResource = (userRole, resourceType, action) => {
  const permissionMap = {
    patientRecord: {
      view: PERMISSIONS.VIEW_PATIENT_RECORD,
      edit: PERMISSIONS.EDIT_PATIENT_DATA
    },
    timeline: {
      view: PERMISSIONS.VIEW_TIMELINE
    },
    provenance: {
      view: PERMISSIONS.VIEW_PROVENANCE
    },
    merge: {
      execute: PERMISSIONS.MPI_MERGE
    },
    audit: {
      view: PERMISSIONS.VIEW_AUDIT_LOGS,
      export: PERMISSIONS.EXPORT_AUDIT_LOGS
    },
    scheduling: {
      book: PERMISSIONS.SCHEDULE_APPOINTMENT,
      override: PERMISSIONS.OVERRIDE_BOOKING
    }
  };

  const permission = permissionMap[resourceType]?.[action];
  return permission ? hasPermission(userRole, permission) : false;
};