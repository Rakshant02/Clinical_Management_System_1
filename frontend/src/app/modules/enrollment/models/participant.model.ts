export type EnrollmentStatus = 'PENDING' | 'ENROLLED' | 'WITHDRAWN';
export type EligibilityStatus = 'ELIGIBLE' | 'INELIGIBLE' | 'PENDING';

export interface Participant {
  participantId: string;    
  name: string;
  dob: string;              
  contactInfo: string;

  // New demographic fields
  gender?: string;
  address?: string;

  // Vital signs
  bp?: string;                        // e.g., "120/80"
  heartRate?: number | null;          // bpm
  temperature?: number | null;        // °C
  spo2?: number | null;               // %
  respiratoryRate?: number | null;    // breaths/min

  // Lab results
  hemoglobin?: number | null;         // g/dL
  diabetes?: number | null;         // mg/dL

  // Status fields
  eligibilityStatus: EligibilityStatus; 
  enrollmentStatus: EnrollmentStatus;

  // 🔗 Link to TrialProtocol 
  protocolId?: string
}
