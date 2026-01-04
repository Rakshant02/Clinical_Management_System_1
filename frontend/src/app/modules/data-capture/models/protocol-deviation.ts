
export interface ProtocolDeviation {
  deviationId?: string;
  protocolId: string;
  participantId: string;
  observationId?: string;
  detectedBy: string;
  description: string;
  severity: 'MINOR' | 'MAJOR' | 'CRITICAL';
  reportedDate: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'CLOSED';
  correctiveAction?: string;
  capaReference?: string;
  siteId?: string;
  

}
