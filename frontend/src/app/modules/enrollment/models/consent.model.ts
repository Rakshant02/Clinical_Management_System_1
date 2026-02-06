// export interface ConsentForm {
//   consentId: string;
//   participantId: string;
//   signedDate: string;
//   status: 'SIGNED' | 'WITHDRAWN';
// }
export enum ConsentStatus { SIGNED = 'SIGNED', WITHDRAWN = 'WITHDRAWN' }
 
export interface ConsentForm {
  consentId: string;
  participantId: string;
  signedDate: string; 
  status: ConsentStatus;
  version?: number;
  updatedDate?: string; 
}