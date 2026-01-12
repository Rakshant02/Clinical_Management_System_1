
// reports.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecimalPipe, PercentPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalyticsService } from '../../services/analytics.service'; // adjust path


@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, PercentPipe, DecimalPipe,],
  providers: [AnalyticsService],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reports: any[] = [];           // bound to service data
  selectedReport: any | null = null;
  avgEnrollmentRate = 0;
  avgCompletionRate = 0;
  str:string="reporting";

  constructor(private analytics: AnalyticsService) {}

  ngOnInit(): void {
    // Load static data from service
    this.reports = this.analytics.getTrialReports();
    this.computeAverages();
  }

  // Call this after you load reports to compute KPIs
  private computeAverages() {
    if (!this.reports?.length) { 
      this.avgEnrollmentRate = 0; 
      this.avgCompletionRate = 0; 
      return; 
    }
    const er = this.reports.map(r => r.metrics?.enrollmentRate ?? 0);
    const cr = this.reports.map(r => r.metrics?.completionRate ?? 0);
    this.avgEnrollmentRate = er.reduce((a,b)=>a+b,0) / er.length;
    this.avgCompletionRate = cr.reduce((a,b)=>a+b,0) / cr.length;
  }

  selectReport(r: any) { this.selectedReport = r; }

  onViewClick(event: MouseEvent, reportId: string) {
    event.stopPropagation();
    const found = this.analytics.getTrialReportById(reportId);
    if (found) this.selectedReport = found;
  }

  /** Utility: trigger JSON download */
  private downloadJSON(filename: string, data: any) {
    const content = JSON.stringify(data, null, 2);
    const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  /** Export all reports in one JSON file */
  exportAllReportsJSON() {
    const payload = this.reports.map(r => ({
      reportId: r.reportId,
      protocolId: r.protocolId,
      metrics: r.metrics,
      generatedDate: r.generatedDate
    }));
    this.downloadJSON('trial_reports.json', payload);
  }

  /** Export a single report (row-level button) */
  exportReportJSON(event: MouseEvent, r: any) {
    event.stopPropagation(); // avoid row selection click
    const filename = `report_${r.reportId}.json`;
    const payload = {
      reportId: r.reportId,
      protocolId: r.protocolId,
      metrics: r.metrics,
      generatedDate: r.generatedDate
    };
    this.downloadJSON(filename, payload);
  }

  /** Export currently selected report from the details panel */
  exportSelectedReportJSON() {
    if (!this.selectedReport) return;
    const r = this.selectedReport;
    const filename = `report_${r.reportId}.json`;
    const payload = {
      reportId: r.reportId,
      protocolId: r.protocolId,
      metrics: r.metrics,
      generatedDate: r.generatedDate
    };
    this.downloadJSON(filename, payload);
  }
}
