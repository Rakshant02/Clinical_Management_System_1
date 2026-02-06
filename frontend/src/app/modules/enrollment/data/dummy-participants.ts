import { Participant } from '../models/participant.model';
import { ConsentForm, ConsentStatus } from '../models/consent.model';

export const DUMMY_PARTICIPANTS: Participant[] = [
  {
    participantId: 'P001',
    name: 'Aasawari',
    dob: '1990-05-12',
    contactInfo: 'aasawari@example.com',
    gender: 'female',
    protocolId: 'PROTO-001',
    address: '123 Main Street, Pune',
    bp: '118/76',
    heartRate: 72,
    temperature: 36.9,
    spo2: 98,
    respiratoryRate: 16,
    hemoglobin: 13.8,
    creatinine: 0.9,
    eligibilityStatus: 'ELIGIBLE',
    enrollmentStatus: 'ENROLLED'
  },
  {
    participantId: 'P002',
    name: 'Sarayu',
    dob: '1985-09-23',
    contactInfo: 'sarayu@example.com',
    gender: 'female',
    protocolId: 'PROTO-001',
    address: '456 Oak Avenue, Mumbai',
    bp: '122/80',
    heartRate: 78,
    temperature: 37.1,
    spo2: 97,
    respiratoryRate: 18,
    hemoglobin: 12.5,
    creatinine: 1.1,
    eligibilityStatus: 'ELIGIBLE',
    enrollmentStatus: 'PENDING'
  },
  {
    participantId: 'P003',
    name: 'Rucha',
    dob: '1999-09-12',
    contactInfo: 'rucha@example.com',
    gender: 'female',
    protocolId: 'PROTO-001',
    address: '789 Hill Road, Mulshi',
    bp: '115/75',
    heartRate: 70,
    temperature: 36.7,
    spo2: 99,
    respiratoryRate: 17,
    hemoglobin: 14.2,
    creatinine: 0.8,
    eligibilityStatus: 'ELIGIBLE',
    enrollmentStatus: 'PENDING'
  }
];

export const DUMMY_CONSENTS: ConsentForm[] = [
  {
    consentId: 'C001',
    participantId: 'P001',
    signedDate: '2025-12-20T10:00:00Z',
    status: ConsentStatus.SIGNED
  }
];
