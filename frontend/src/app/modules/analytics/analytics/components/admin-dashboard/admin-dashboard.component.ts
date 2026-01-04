
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  
  protocols: any[] = [];
  trialReports: any[] = [];
  complianceReports: any[] = [];
  auditLogs: any[] = [];
  adverseEvents: any[] = [];

  
  selectedProtocolId: string ='';

  
  filteredTrialReports: any[] = [];
  filteredComplianceReports: any[] = [];
  filteredAdverseEvents: any[] = [];

  constructor(private analytics: AnalyticsService) {}

  ngOnInit(): void {
    
    this.protocols = this.analytics.getProtocols();

    this.trialReports = this.analytics.getTrialReports();
    this.complianceReports = this.analytics.getComplianceReports();
    this.auditLogs = this.analytics.getAuditLogs();
    this.adverseEvents = this.analytics.getAdverseEvents();

    
    this.selectedProtocolId = this.protocols?.[0]?.protocolId ?? '';
    this.updateSelection();
  }

  onProtocolChange(protocolId: string) {
    this.selectedProtocolId = protocolId;
    this.updateSelection();
  }

  private updateSelection() {
    if (!this.selectedProtocolId) {
      this.filteredTrialReports = [];
      this.filteredComplianceReports = [];
      this.filteredAdverseEvents = [];
      return;
    }

    this.filteredTrialReports = this.trialReports.filter(r => r.protocolId === this.selectedProtocolId);
    this.filteredComplianceReports = this.complianceReports.filter(cr => cr.protocolId === this.selectedProtocolId);
    this.filteredAdverseEvents = this.adverseEvents.filter(ae => ae.protocolId === this.selectedProtocolId);
  }

  

  get avgEnrollmentRate(): number {
    if (!this.filteredTrialReports.length) return 0;
    const sum = this.filteredTrialReports.reduce((acc, r) => acc + (r.metrics.enrollmentRate ?? 0), 0);
    return sum / this.filteredTrialReports.length;
  }

  get avgCompletionRate(): number {
    if (!this.filteredTrialReports.length) return 0;
    const sum = this.filteredTrialReports.reduce((acc, r) => acc + (r.metrics.completionRate ?? 0), 0);
    return sum / this.filteredTrialReports.length;
  }

  get hipaaCompliantCount(): number {
    return this.filteredComplianceReports.filter(cr => cr.hipaaCompliant).length;
  }

  get gcpCompliantCount(): number {
    return this.filteredComplianceReports.filter(cr => cr.gcpCompliant).length;
  }

  get totalComplianceReports(): number {
    return this.filteredComplianceReports.length;
  }

  get totalIssues(): number {
    return this.filteredComplianceReports.reduce((acc, cr) => acc + (cr.issues?.length ?? 0), 0);
  }

  get adverseEventCount(): number {
    return this.filteredAdverseEvents.length;
  }

  get adverseEventSevereCount(): number {
    return this.filteredAdverseEvents.filter(ae => ae.severity === 'severe').length;
  }
}
