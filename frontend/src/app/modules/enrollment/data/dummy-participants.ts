import { Participant } from '../models/participant.model';
import { ConsentForm } from '../models/consent.model';

export const DUMMY_PARTICIPANTS: Participant[] = [
  {
    id: 'P001',
    name: 'Aasawari',
    dob: '1990-05-12',
    contactInfo: 'aasawari@example.com',
    eligibilityStatus: 'Eligible',
    enrollmentStatus: 'ENROLLED'
  },
  {
    id: 'P002',
    name: 'Sarayu',
    dob: '1985-09-23',
    contactInfo: 'sarayu@example.com',
    eligibilityStatus: 'Eligible',
    enrollmentStatus: 'PENDING'
  },
  {
    id: 'P003',
    name: 'Rucha',
    dob: '1999-09-12',
    contactInfo: 'rucha@example.com',
    eligibilityStatus: 'Eligible',
    enrollmentStatus: 'PENDING'
  }
];

export const DUMMY_CONSENTS: ConsentForm[] = [
  {
    consentId: 'C001',
    participantId: 'P001',
    signedDate: '2025-12-20T10:00:00Z',
    status: 'SIGNED'
  }
];
