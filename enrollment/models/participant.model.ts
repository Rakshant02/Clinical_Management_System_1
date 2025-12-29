export type EligibilityStatus = 'ELIGIBLE' | 'NOT_ELIGIBLE' | 'PENDING';
export type ConsentStatus = 'SIGNED' | 'WITHDRAWN' | 'PENDING';

export interface Participant {
  id: string;
  name: string;
  dob: string; // ISO date string
  contactInfo: string;
  eligibilityStatus: EligibilityStatus;
  consentStatus: ConsentStatus;
}
