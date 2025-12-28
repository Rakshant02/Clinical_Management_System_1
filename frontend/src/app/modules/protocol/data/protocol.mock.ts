
import { TrialProtocol, TrialStatus, TrialPhase } from '../models/trial-protocol.model';

export const PROTOCOL_MOCK: TrialProtocol[] = [
  {
    protocolId: 'P-1001',
    title: 'Oncology – Biomarker Response Study',
    phase: TrialPhase.II,
    startDate: '2025-08-10',
    endDate: '2026-02-15',
    status: TrialStatus.ACTIVE,
    objectives: 'Evaluate biomarker expression vs outcomes.',
    inclusionCriteria: 'Adults ≥18; ECOG 0–1.',
    exclusionCriteria: 'Pregnancy; severe cardiac disease.',
    version: 1,
    investigators: [
      { name: 'Dr. Asha Kulkarni', email: 'asha.kulkarni@biotrack.example', siteId: 'S-001' },
      { name: 'Dr. Rohan Mehta', email: 'rohan.mehta@biotrack.example', siteId: 'S-003' }
    ],
    studySiteIds: ['S-001', 'S-003'],
    documents: [{ id: 'D-01', name: 'Protocol v1.0.pdf', uploadedAt: '2025-08-08' }]
  },
  {
    protocolId: 'P-1002',
    title: 'Cardiology – Phase III Outcome Trial',
    phase: TrialPhase.III,
    startDate: '2025-07-01',
    endDate: '2027-01-31',
    status: TrialStatus.ACTIVE,
    version: 1,
    investigators: [{ name: 'Dr. Meera Shah', email: 'meera.shah@biotrack.example', siteId: 'S-002' }],
    studySiteIds: ['S-002', 'S-004']
  },
  {
    protocolId: 'P-1003',
    title: 'Immunology – Phase I Safety Study',
    phase: TrialPhase.I,
    startDate: '2025-09-20',
    endDate: '2026-03-10',
    status: TrialStatus.COMPLETED,
    version: 2,
    investigators: [{ name: 'Dr. Vikram Desai', email: 'vikram.desai@biotrack.example', siteId: 'S-001' }],
    studySiteIds: ['S-001']
  },
  {
    protocolId: 'P-1004',
    title: 'Neurology – Cognitive Function Trial',
    phase: TrialPhase.II,
    startDate: '2025-10-01',
    endDate: '2026-10-01',
    status: TrialStatus.ACTIVE,
    version: 1,
    investigators: [{ name: 'Dr. Nidhi Rao', email: 'nidhi.rao@biotrack.example', siteId: 'S-005' }],
    studySiteIds: ['S-005']
  },
  {
    protocolId: 'P-1005',
    title: 'Endocrinology – Diabetes Adjunct Therapy',
    phase: TrialPhase.III,
    startDate: '2025-11-15',
    endDate: '2027-05-15',
    status: TrialStatus.ACTIVE,
    version: 1,
    investigators: [{ name: 'Dr. Ajay Hegde', email: 'ajay.hegde@biotrack.example', siteId: 'S-006' }],
    studySiteIds: ['S-006']
  }
];
