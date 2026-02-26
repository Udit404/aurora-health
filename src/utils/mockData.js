export const mockPatients = [
  {
    id: "patient-001",
    primaryMRN: "MRN-12345",
    linkedMRNs: [
      { mrn: "MRN-12345", source: "Epic", status: "active", lastSynced: "2024-01-15T10:30:00Z" },
      { mrn: "MRN-67890", source: "Cerner", status: "active", lastSynced: "2024-01-15T10:28:00Z" },
      { mrn: "MRN-11111", source: "Allscripts", status: "stale", lastSynced: "2024-01-14T08:15:00Z" }
    ],
    demographics: {
      firstName: "Sarah",
      lastName: "Johnson",
      dateOfBirth: "1985-06-15",
      gender: "Female",
      ssn: "***-**-4567",
      phone: "(555) 123-4567",
      email: "sarah.johnson@email.com",
      address: "123 Main St, Boston, MA 02101"
    },
    riskFlags: [
      { type: "fall-risk", score: 85, label: "High Fall Risk", color: "error", lastUpdated: "2024-01-14T14:20:00Z", source: "Epic" },
      { type: "allergy", score: 95, label: "Severe Allergies", color: "warning", lastUpdated: "2024-01-10T09:00:00Z", source: "Cerner" }
    ],
    matchConfidence: 98.5
  },
  {
    id: "patient-002",
    primaryMRN: "MRN-54321",
    linkedMRNs: [
      { mrn: "MRN-54321", source: "Epic", status: "active", lastSynced: "2024-01-15T11:00:00Z" }
    ],
    demographics: {
      firstName: "Michael",
      lastName: "Chen",
      dateOfBirth: "1972-03-22",
      gender: "Male",
      ssn: "***-**-7890",
      phone: "(555) 987-6543",
      email: "m.chen@email.com",
      address: "456 Oak Ave, Cambridge, MA 02139"
    },
    riskFlags: [
      { type: "diabetes", score: 78, label: "Diabetes Management", color: "info", lastUpdated: "2024-01-12T16:45:00Z", source: "Epic" }
    ],
    matchConfidence: 100
  }
];

export const mockMedications = [
  {
    id: "med-001",
    name: "Lisinopril 10mg",
    dosage: "10mg once daily",
    prescriber: "Dr. Smith",
    startDate: "2023-06-01",
    status: "Active",
    source: "Epic",
    sourceMRN: "MRN-12345",
    lastUpdated: "2024-01-10T08:00:00Z",
    ingestedAt: "2024-01-10T08:05:00Z",
    versionId: "v3",
    provenance: {
      author: "Dr. Smith",
      system: "Epic",
      timestamp: "2024-01-10T08:00:00Z"
    }
  },
  {
    id: "med-002",
    name: "Metformin 500mg",
    dosage: "500mg twice daily",
    prescriber: "Dr. Johnson",
    startDate: "2023-08-15",
    status: "Active",
    source: "Cerner",
    sourceMRN: "MRN-67890",
    lastUpdated: "2024-01-12T14:30:00Z",
    ingestedAt: "2024-01-12T14:32:00Z",
    versionId: "v2",
    provenance: {
      author: "Dr. Johnson",
      system: "Cerner",
      timestamp: "2024-01-12T14:30:00Z"
    }
  }
];

export const mockAllergies = [
  {
    id: "allergy-001",
    allergen: "Penicillin",
    reaction: "Anaphylaxis",
    severity: "Severe",
    status: "Active",
    source: "Epic",
    sourceMRN: "MRN-12345",
    lastUpdated: "2023-05-20T10:00:00Z",
    ingestedAt: "2023-05-20T10:02:00Z",
    versionId: "v1",
    provenance: {
      author: "Dr. Williams",
      system: "Epic",
      timestamp: "2023-05-20T10:00:00Z"
    }
  },
  {
    id: "allergy-002",
    allergen: "Sulfa drugs",
    reaction: "Rash",
    severity: "Moderate",
    status: "Active",
    source: "Cerner",
    sourceMRN: "MRN-67890",
    lastUpdated: "2023-07-10T15:30:00Z",
    ingestedAt: "2023-07-10T15:31:00Z",
    versionId: "v1",
    provenance: {
      author: "Dr. Brown",
      system: "Cerner",
      timestamp: "2023-07-10T15:30:00Z"
    }
  }
];

export const mockProblems = [
  {
    id: "problem-001",
    condition: "Hypertension",
    status: "Active",
    onsetDate: "2020-03-15",
    source: "Epic",
    sourceMRN: "MRN-12345",
    lastUpdated: "2024-01-05T09:00:00Z",
    ingestedAt: "2024-01-05T09:02:00Z",
    versionId: "v5",
    provenance: {
      author: "Dr. Smith",
      system: "Epic",
      timestamp: "2024-01-05T09:00:00Z"
    }
  },
  {
    id: "problem-002",
    condition: "Type 2 Diabetes",
    status: "Active",
    onsetDate: "2021-08-20",
    source: "Cerner",
    sourceMRN: "MRN-67890",
    lastUpdated: "2024-01-08T11:15:00Z",
    ingestedAt: "2024-01-08T11:16:00Z",
    versionId: "v3",
    provenance: {
      author: "Dr. Johnson",
      system: "Cerner",
      timestamp: "2024-01-08T11:15:00Z"
    }
  }
];

export const mockLabs = [
  {
    id: "lab-001",
    test: "HbA1c",
    value: "6.8%",
    range: "4.0-5.6%",
    status: "Final",
    date: "2024-01-12",
    source: "Epic",
    sourceMRN: "MRN-12345",
    lastUpdated: "2024-01-12T16:00:00Z",
    ingestedAt: "2024-01-12T16:05:00Z",
    versionId: "v1",
    provenance: {
      author: "Lab Tech A",
      system: "Epic",
      timestamp: "2024-01-12T16:00:00Z"
    }
  },
  {
    id: "lab-002",
    test: "Glucose",
    value: "110 mg/dL",
    range: "70-100 mg/dL",
    status: "Final",
    date: "2024-01-12",
    source: "Epic",
    sourceMRN: "MRN-12345",
    lastUpdated: "2024-01-12T16:00:00Z",
    ingestedAt: "2024-01-12T16:05:00Z",
    versionId: "v1",
    provenance: {
      author: "Lab Tech A",
      system: "Epic",
      timestamp: "2024-01-12T16:00:00Z"
    }
  }
];

export const mockEncounters = [
  {
    id: "encounter-001",
    date: "2024-01-10T09:00:00Z",
    type: "Office Visit",
    facility: "Boston General Hospital",
    provider: "Dr. Smith",
    source: "Epic",
    sourceMRN: "MRN-12345",
    status: "Completed",
    chiefComplaint: "Follow-up hypertension",
    lastUpdated: "2024-01-10T11:30:00Z",
    syncStatus: "active",
    lastSynced: "2024-01-15T10:30:00Z",
    hasConflict: false,
    versionId: "v2",
    provenance: {
      author: "Dr. Smith",
      system: "Epic",
      timestamp: "2024-01-10T11:30:00Z"
    }
  },
  {
    id: "encounter-002",
    date: "2024-01-05T14:30:00Z",
    type: "Lab Draw",
    facility: "Cambridge Medical Center",
    provider: "Lab Services",
    source: "Cerner",
    sourceMRN: "MRN-67890",
    status: "Completed",
    chiefComplaint: "Routine lab work",
    lastUpdated: "2024-01-05T15:00:00Z",
    syncStatus: "active",
    lastSynced: "2024-01-15T10:28:00Z",
    hasConflict: false,
    versionId: "v1",
    provenance: {
      author: "Lab Services",
      system: "Cerner",
      timestamp: "2024-01-05T15:00:00Z"
    }
  },
  {
    id: "encounter-003",
    date: "2023-12-20T10:00:00Z",
    type: "Telehealth",
    facility: "Virtual Care Center",
    provider: "Dr. Johnson",
    source: "Epic",
    sourceMRN: "MRN-12345",
    status: "Completed",
    chiefComplaint: "Medication refill",
    lastUpdated: "2023-12-20T10:30:00Z",
    syncStatus: "active",
    lastSynced: "2024-01-15T10:30:00Z",
    hasConflict: false,
    versionId: "v1",
    provenance: {
      author: "Dr. Johnson",
      system: "Epic",
      timestamp: "2023-12-20T10:30:00Z"
    }
  }
];

export const mockCareTeam = [
  {
    id: "team-001",
    name: "Dr. Sarah Smith",
    role: "Primary Care Physician",
    specialty: "Internal Medicine",
    contact: "(555) 111-2222",
    source: "Epic",
    lastUpdated: "2024-01-01T08:00:00Z"
  },
  {
    id: "team-002",
    name: "Dr. Robert Johnson",
    role: "Endocrinologist",
    specialty: "Endocrinology",
    contact: "(555) 333-4444",
    source: "Cerner",
    lastUpdated: "2023-12-15T10:00:00Z"
  }
];

export const mockAppointmentSlots = [
  {
    id: "slot-001",
    datetime: "2024-01-20T09:00:00Z",
    provider: "Dr. Smith",
    facility: "Boston General Hospital",
    type: "In-Person",
    specialty: "Internal Medicine",
    available: true,
    distance: "2.3 miles",
    waitTime: "5 min",
    priority: 1,
    rationale: "Earliest available with your primary care physician"
  },
  {
    id: "slot-002",
    datetime: "2024-01-20T14:00:00Z",
    provider: "Dr. Williams",
    facility: "Cambridge Medical Center",
    type: "Telehealth",
    specialty: "Internal Medicine",
    available: true,
    distance: "N/A",
    waitTime: "0 min",
    priority: 2,
    rationale: "Same-day telehealth option"
  }
];

export const mockFeedStatus = [
  {
    source: "Epic",
    status: "active",
    lastSynced: "2024-01-15T10:30:00Z",
    nextSync: "2024-01-15T11:30:00Z"
  },
  {
    source: "Cerner",
    status: "active",
    lastSynced: "2024-01-15T10:28:00Z",
    nextSync: "2024-01-15T11:28:00Z"
  },
  {
    source: "Allscripts",
    status: "unavailable",
    lastSynced: "2024-01-14T08:15:00Z",
    nextSync: null,
    outageReason: "System maintenance"
  }
];

export const mockAuditLogs = [
  {
    id: "audit-001",
    timestamp: "2024-01-15T10:35:00Z",
    actor: "Dr. Smith",
    role: "Clinician",
    action: "VIEW_PATIENT_RECORD",
    patientId: "patient-001",
    patientMRN: "MRN-12345",
    resource: "PatientRecord",
    outcome: "SUCCESS",
    ipAddress: "192.168.1.100"
  },
  {
    id: "audit-002",
    timestamp: "2024-01-15T10:32:00Z",
    actor: "Nurse Johnson",
    role: "CareCoordinator",
    action: "VIEW_TIMELINE",
    patientId: "patient-001",
    patientMRN: "MRN-12345",
    resource: "Timeline",
    outcome: "SUCCESS",
    ipAddress: "192.168.1.105"
  },
  {
    id: "audit-003",
    timestamp: "2024-01-15T10:30:00Z",
    actor: "Admin User",
    role: "Administrator",
    action: "ATTEMPTED_MERGE",
    patientId: "patient-001",
    patientMRN: "MRN-12345",
    resource: "MPIMerge",
    outcome: "DENIED",
    reason: "Insufficient permissions",
    ipAddress: "192.168.1.200"
  }
];