export type EnrollmentStatus = 'PENDING' | 'ENROLLED' | 'WITHDRAWN';
 
export interface Participant {
  participantId: string;    // <-- rename 'id' to 'participantId'
  name: string;
  dob: string;              // ISO
  contactInfo: string;
  eligibilityStatus: 'ELIGIBLE' | 'INELIGIBLE' | 'PENDING'; // stronger typing
  enrollmentStatus: EnrollmentStatus;
}
 