import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardSubtitle,
  MatCardContent,
  MatCardActions,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatChip } from '@angular/material/chips';
import { MatPaginator } from '@angular/material/paginator';
import { CdkTableDataSourceInput } from '@angular/cdk/table';


@Component({
  selector: 'app-compliance-report',
  imports: [
    MatTableModule,
    CommonModule,
    MatCard,
    MatCardHeader,
    MatIcon,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatCardActions,
    MatChip,
    MatPaginator,
  ],
  standalone: true,
  templateUrl: './compliance-report.component.html',
  styleUrl: './compliance-report.component.css',
})


export class ComplianceReportComponent {


  goToReports() {
    this.router.navigate(['/compliance/actions']);
  }


  totalDeviationCount: number = 0;
  averageAdherenceRate: number = 0;
  complianceReports = [
    {
      reportID: 'CR-001',
      deviationCount: 2,
      adherenceRate: 98,
      generatedDate: '2025-12-21',
    },
    {
      reportID: 'CR-002',
      deviationCount: 5,
      adherenceRate: 95,
      generatedDate: '2025-12-22',
    },
    {
      reportID: 'CR-003',
      deviationCount: 1,
      adherenceRate: 99,
      generatedDate: '2025-12-23',
    },
  ];

  dataSource = new MatTableDataSource<any>(this.complianceReports);
  displayedColumns: string[] = [
    'reportID',
    'deviationCount',
    'adherenceRate',
    'generatedDate',
    'actions',
  ];
  constructor(private router: Router) {}
  
  goToActions() {
    this.router.navigate(['/compliance/actions']);
  }
  downloadReport(report: any) {
    console.log('Download report', report);
  }
  viewDetails(report: any) {
    console.log('View details', report);
  }
}
