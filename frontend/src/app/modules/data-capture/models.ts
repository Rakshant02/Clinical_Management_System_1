
// Mandatory Entities (using the exact field names you specified)

export type Severity = 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL';
export type Status = 'OPEN' | 'UNDER_REVIEW' | 'CLOSED';

export interface Observation {
  ObservationID: string;
  ParticipantID: string;
  VisitDate: string; // ISO (yyyy-MM-dd)
  DataPoints?: {
    Vitals?: { bp?: string; heartRate?: number; temperature?: number; spo2?: number; respiratoryRate?: number };
    LabResults?: Record<string, any>;
  };
}

export interface AdverseEvent {
  EventID: string;
  ParticipantID: string;
  Description: string;
  Severity: Severity;
  ReportedDate: string; // ISO date
  Status?: 'OPEN' | 'CLOSED' | 'UNDER_REVIEW';
  Outcome?: string;
}

export interface ProtocolDeviation {
  DeviationID: string;
  ProtocolID?: string;
  ParticipantID: string;
  ObservationID?: string;
  Description: string;
  Severity: 'MINOR' | 'MAJOR' | 'CRITICAL';
  Status: 'OPEN' | 'UNDER_REVIEW' | 'CLOSED';
  DetectedBy: string;
  ReportedDate: string; // ISO date/time
  CorrectiveAction?: string;
  CapaReference?: string;
}


export interface Deviation {
  id: string;
  protocol: string;
  participant: string;
  observation?: string;
  detectedBy?: string;
  severity: Severity;
  status: Status;
  reportedAt: string;   // ISO string
  description?: string;
  capaRef?: string;
  correctiveAction?: string;
}
