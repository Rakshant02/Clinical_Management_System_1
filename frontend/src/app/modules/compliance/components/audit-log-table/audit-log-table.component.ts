import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface AuditLog {
  logID: number;
  actionPerformed: string;
  userID: string;
  timestamp: Date;
}
@Component({
  selector: 'app-audit-log-table',
  imports: [
    CommonModule,
    MatTableModule,
    RouterLink,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  standalone: true,
  templateUrl: './audit-log-table.component.html',
  styleUrl: './audit-log-table.component.css',
})
export class AuditLogTableComponent implements AfterViewInit {
  constructor(private router: Router) {}

  displayedColumns: string[] = [
    'logID',
    'actionPerformed',
    'userID',
    'timestamp',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  goToReports() {
    this.router.navigate(['/compliance/reports']);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  viewDetails(log: any) {
    alert(`Viewing details for Log ID: ${log.logID}`);
  }
  downloadLog(log: any) {
    alert(`Downloading log for Log ID: ${log.logID}`);
  }
  getRowClass(log: any) {
    return log.actionPerformed.includes('Adverse') ? 'row-danger' : 'row-safe';
  }

  get violationCount(): number {
  return this.auditLogs.filter(log => log.actionPerformed.includes('Adverse')).length;
  }


  auditLogs = [
    {
      logID: 101,
      actionPerformed: 'Consent Form Signed',
      userID: 'User01',
      timestamp: '2025-12-20 10:15',
    },
    {
      logID: 102,
      actionPerformed: 'Observation Added',
      userID: 'Researcher02',
      timestamp: '2025-12-21 14:30',
    },
    {
      logID: 103,
      actionPerformed: 'Adverse Event Reported',
      userID: 'Researcher03',
      timestamp: '2025-12-22 09:45',
    },
    {
      logID: 104,
      actionPerformed: 'Compliance Report Generated',
      userID: 'Admin01',
      timestamp: '2025-12-22 16:00',
    },
  ];
  dataSource = new MatTableDataSource(this.auditLogs);
}
