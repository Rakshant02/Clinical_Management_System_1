export enum ConsentStatus { SIGNED = 'SIGNED', WITHDRAWN = 'WITHDRAWN' }
 
export interface ConsentForm {
  consentId: string;
  participantId: string;
  signedDate: string; // ISO
  status: ConsentStatus;
  version?: number;
  updatedDate?: string; // ISO
}