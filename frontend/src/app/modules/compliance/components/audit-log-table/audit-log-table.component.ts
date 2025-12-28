import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-audit-log-table',
  imports: [CommonModule, MatTableModule],
  standalone: true,
  templateUrl: './audit-log-table.component.html',
  styleUrl: './audit-log-table.component.css',
})
export class AuditLogTableComponent {
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
}
