export interface Participant {
  id: string;
  name: string;
  dob: string;
  contactInfo: string;
  eligibilityStatus: string;
  // consentStatus: string;
  enrollmentStatus: 'PENDING' | 'ENROLLED' | 'WITHDRAWN'; // new field

}
