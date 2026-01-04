
export enum TrialPhase { I = 'I', II = 'II', III = 'III' }
export enum TrialStatus { ACTIVE = 'ACTIVE', COMPLETED = 'COMPLETED' }

export interface Investigator {
  id?: string;
  name: string;
  email?: string;
  siteId?: string; // assign investigator to a StudySite
}

export interface ProtocolDocument {
  id?: string;
  name: string;
  uploadedAt?: string;
  url?: string;
}

export interface TrialProtocol {
  protocolId: string;
  title: string;
  phase: TrialPhase;
  startDate: string;
  endDate?: string;
  status: TrialStatus;

  objectives?: string;
  inclusionCriteria?: string;
  exclusionCriteria?: string;

  version?: number;
  investigators?: Investigator[];
  studySiteIds?: string[];
  documents?: ProtocolDocument[];
}

