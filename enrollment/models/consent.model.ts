export type ConsentState = 'SIGNED' | 'WITHDRAWN' | 'PENDING';

export interface ConsentForm {
  id?: string;
  participantId: string;
  signedDate?: string; // ISO date
  status: ConsentState;
  documentUrl?: string;
}
