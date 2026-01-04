import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() { }

  private protocols = [
    {
      protocolId: 'TP-001',
      title: 'Phase II: Glycemic Control in Type 2 Diabetes',
      phase: 'II',
      targetEnrollment: 200,
      startDate: '2025-09-15',
      endDate: '2026-12-31',
      sponsor: 'Acme Pharma',
      regulators: ['FDA', 'EMA', 'DCGI'],
    },
    {
      protocolId: 'TP-002',
      title: 'Phase III: Cardiovascular Outcomes Study',
      phase: 'III',
      targetEnrollment: 500,
      startDate: '2025-07-01',
      endDate: '2027-03-31',
      sponsor: 'BioHealth Inc.',
      regulators: ['FDA'],
    },
  ];

  private studySites = [
    {
      siteId: 'SITE-PUN-01',
      protocolId: 'TP-001',
      name: 'Cognizant Clinical Center',
      location: 'Pune, MH',
      principalInvestigator: 'Dr. A. Kulkarni',
    },
    {
      siteId: 'SITE-MUM-01',
      protocolId: 'TP-001',
      name: 'Western Medical Institute',
      location: 'Mumbai, MH',
      principalInvestigator: 'Dr. S. Desai',
    },
    {
      siteId: 'SITE-DEL-01',
      protocolId: 'TP-002',
      name: 'Capital Cardio Research',
      location: 'New Delhi, DL',
      principalInvestigator: 'Dr. R. Sharma',
    },
  ];

  private participants = [
    
    { participantId: 'P-0001', protocolId: 'TP-001', siteId: 'SITE-PUN-01', enrolledDate: '2025-09-20', status: 'enrolled', age: 42, gender: 'Male' },
    { participantId: 'P-0002', protocolId: 'TP-001', siteId: 'SITE-PUN-01', enrolledDate: '2025-10-05', status: 'completed', age: 50, gender: 'Female' },
    { participantId: 'P-0003', protocolId: 'TP-001', siteId: 'SITE-MUM-01', enrolledDate: '2025-10-10', status: 'enrolled', age: 36, gender: 'Female' },
    { participantId: 'P-0004', protocolId: 'TP-001', siteId: 'SITE-MUM-01', enrolledDate: '2025-11-01', status: 'withdrawn', age: 29, gender: 'Male' },
    { participantId: 'P-0005', protocolId: 'TP-001', siteId: 'SITE-PUN-01', enrolledDate: '2025-11-18', status: 'completed', age: 55, gender: 'Male' },
    { participantId: 'P-0006', protocolId: 'TP-001', siteId: 'SITE-MUM-01', enrolledDate: '2025-12-02', status: 'enrolled', age: 47, gender: 'Other' },

    
    { participantId: 'P-1001', protocolId: 'TP-002', siteId: 'SITE-DEL-01', enrolledDate: '2025-07-15', status: 'completed', age: 61, gender: 'Male' },
    { participantId: 'P-1002', protocolId: 'TP-002', siteId: 'SITE-DEL-01', enrolledDate: '2025-08-03', status: 'enrolled', age: 58, gender: 'Female' },
    { participantId: 'P-1003', protocolId: 'TP-002', siteId: 'SITE-DEL-01', enrolledDate: '2025-09-09', status: 'withdrawn', age: 65, gender: 'Male' },
    { participantId: 'P-1004', protocolId: 'TP-002', siteId: 'SITE-DEL-01', enrolledDate: '2025-10-01', status: 'completed', age: 52, gender: 'Female' },
  ];

  private consents = [
    { consentId: 'C-0001', participantId: 'P-0001', consentDate: '2025-09-20', digitalSignature: true, version: 'v1.0' },
    { consentId: 'C-0002', participantId: 'P-0002', consentDate: '2025-10-05', digitalSignature: true, version: 'v1.0' },
    { consentId: 'C-0003', participantId: 'P-0003', consentDate: '2025-10-10', digitalSignature: true, version: 'v1.1' },
    { consentId: 'C-0004', participantId: 'P-0004', consentDate: '2025-11-01', digitalSignature: true, version: 'v1.1' },
    { consentId: 'C-0005', participantId: 'P-0005', consentDate: '2025-11-18', digitalSignature: true, version: 'v1.2' },
    { consentId: 'C-0006', participantId: 'P-0006', consentDate: '2025-12-02', digitalSignature: true, version: 'v1.2' },
    { consentId: 'C-1001', participantId: 'P-1001', consentDate: '2025-07-15', digitalSignature: true, version: 'v3.0' },
    { consentId: 'C-1002', participantId: 'P-1002', consentDate: '2025-08-03', digitalSignature: true, version: 'v3.0' },
    { consentId: 'C-1003', participantId: 'P-1003', consentDate: '2025-09-09', digitalSignature: true, version: 'v3.1' },
    { consentId: 'C-1004', participantId: 'P-1004', consentDate: '2025-10-01', digitalSignature: true, version: 'v3.1' },
  ];

  private observations = [
    { observationId: 'O-0001', participantId: 'P-0001', date: '2025-10-01', type: 'HbA1c', value: 7.2, unit: '%' },
    { observationId: 'O-0002', participantId: 'P-0002', date: '2025-10-20', type: 'HbA1c', value: 6.5, unit: '%' },
    { observationId: 'O-0003', participantId: 'P-0003', date: '2025-11-05', type: 'BP', value: 130, unit: 'mmHg' },
    { observationId: 'O-0004', participantId: 'P-0005', date: '2025-12-01', type: 'HbA1c', value: 6.8, unit: '%' },
    { observationId: 'O-1001', participantId: 'P-1001', date: '2025-08-01', type: 'LDL', value: 95, unit: 'mg/dL' },
    { observationId: 'O-1002', participantId: 'P-1002', date: '2025-09-10', type: 'HR', value: 78, unit: 'bpm' },
  ];

  private adverseEvents = [
    { aeId: 'AE-0001', participantId: 'P-0004', protocolId: 'TP-001', date: '2025-11-15', severity: 'moderate', description: 'GI discomfort', relatedToDrug: true },
    { aeId: 'AE-1001', participantId: 'P-1003', protocolId: 'TP-002', date: '2025-09-20', severity: 'severe', description: 'Arrhythmia episode', relatedToDrug: false },
  ];

  private auditLogs = [
    { logId: 'AL-0001', actor: 'researcher@site', action: 'Create Participant', timestamp: '2025-09-20T10:00:00Z', entityType: 'Participant', entityId: 'P-0001' },
    { logId: 'AL-0002', actor: 'admin@hq', action: 'Generate Compliance Report', timestamp: '2025-12-10T12:30:00Z', entityType: 'ComplianceReport', entityId: 'CR-001' },
  ];

  private complianceReports = [
    {
      reportId: 'CR-001',
      protocolId: 'TP-001',
      siteId: 'SITE-PUN-01',
      hipaaCompliant: true,
      gcpCompliant: true,
      issues: [],
      generatedDate: '2025-12-10',
    },
    {
      reportId: 'CR-002',
      protocolId: 'TP-002',
      hipaaCompliant: true,
      gcpCompliant: false,
      issues: ['Missing monitoring visit documentation'],
      generatedDate: '2025-11-25',
    },
  ];

  private trialReports = [
    {
      reportId: 'TR-TP-001-001',
      protocolId: 'TP-001',
      metrics: {
        enrollmentRate: 0.045,
        completionRate: 0.40,
        retentionRate: 0.80,
        progressPercent: 25.0,
      },
      generatedDate: '2025-12-20',
    },
    {
      reportId: 'TR-TP-002-001',
      protocolId: 'TP-002',
      metrics: {
        enrollmentRate: 0.008,
        completionRate: 0.50,
        retentionRate: 0.75,
        progressPercent: 15.0,
      },
      generatedDate: '2025-10-15',
    },
  ];

  

  // You can add getter methods if needed:
  getProtocols() { return this.protocols; }
  getParticipants() { return this.participants; }
  getTrialReports() { return this.trialReports; }
  
getComplianceReports() { return this.complianceReports; }
getAuditLogs() { return this.auditLogs; }
getAdverseEvents() { return this.adverseEvents; }


// analytics.service.ts (add this helper)
getTrialReportById(reportId: string) {
  return this.getTrialReports().find(r => r.reportId === reportId) ?? null;
}


}




