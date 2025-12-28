import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-compliance-report',
  imports: [MatTableModule , CommonModule],
  standalone:true,
  templateUrl: './compliance-report.component.html',
  styleUrl: './compliance-report.component.css',
})
export class ComplianceReportComponent {
  complianceReports = [
    {
      reportID: 'CR-001',
      deviationCount: 2,
      adherenceRate: '98%',
      generatedDate: '2025-12-21',
    },
    {
      reportID: 'CR-002',
      deviationCount: 5,
      adherenceRate: '95%',
      generatedDate: '2025-12-22',
    },
    {
      reportID: 'CR-003',
      deviationCount: 1,
      adherenceRate: '99%',
      generatedDate: '2025-12-23',
    },
  ];
}
