
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reports: Array<{
    reportId: string;
    protocolId: string;
    metrics: {
      enrollmentRate: number;
      completionRate: number;
      retentionRate?: number;
      progressPercent?: number;
    };
    generatedDate: string;
  }> = [];

  // Optional: selected report for a details panel
  selectedReport: 
| {
        reportId: string;
        protocolId: string;
        metrics: {
          enrollmentRate: number;
          completionRate: number;
          retentionRate?: number;
          progressPercent?: number;
        };
        generatedDate: string;
      }
    | null = null;


  constructor(private analytics: AnalyticsService) {}

  ngOnInit(): void {
    this.reports = this.analytics.getTrialReports();
    // Auto-select the first report (optional)
    this.selectedReport = this.reports?.[0] ?? null;
  }

selectReport(report: any) {
  this.selectedReport = report;
}

onViewClick(event: MouseEvent, reportId: string) {
  event.stopPropagation();
  const found = this.reports.find(r => r.reportId === reportId) ?? null;
  this.selectedReport = found;
}
  

  // Helper getters for summary KPI cards
  get avgEnrollmentRate(): number {
    if (!this.reports?.length) return 0;
    const sum = this.reports.reduce((acc, r) => acc + (r.metrics.enrollmentRate ?? 0), 0);
    return sum / this.reports.length;
  }

  get avgCompletionRate(): number {
    if (!this.reports?.length) return 0;
    const sum = this.reports.reduce((acc, r) => acc + (r.metrics.completionRate ?? 0), 0);
    return sum / this.reports.length;
  }
}
