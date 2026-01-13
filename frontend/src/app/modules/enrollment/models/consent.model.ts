export interface ConsentForm {
  consentId: string;
  participantId: string;
  signedDate: string;
  status: 'SIGNED' | 'WITHDRAWN';
}