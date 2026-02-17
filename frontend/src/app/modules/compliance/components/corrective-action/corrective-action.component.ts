import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import {
  MatCardActions,
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
} from '@angular/material/card';
import { MatPaginator } from '@angular/material/paginator';
import { MatIcon } from '@angular/material/icon';
import { MatChip } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-corrective-action',
  imports: [
    CommonModule,
    MatTableModule,
    MatCardActions,
    MatPaginator,
    MatIcon,
    MatChip,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
  ],
  standalone: true,
  templateUrl: './corrective-action.component.html',
  styleUrl: './corrective-action.component.css',
})
export class CorrectiveActionComponent {
  constructor(private router: Router) {}
  goToReports() {
    this.router.navigate(['/compliance/audit-log']);
  }

  viewAction(_t79: any) {
    throw new Error('Method not implemented.');
  }
  editAction(_t79: any) {
    throw new Error('Method not implemented.');
  }

  get openIssuesCount(): number {
    return this.correctiveActions.filter((a) => a.status !== 'COMPLETED')
      .length;
  }
  correctiveActions = [
    {
      actionID: 'CA-001',
      description: 'Update consent form wording',
      assignedTo: 'Admin01',
      status: 'OPEN',
      dueDate: '2025-12-25',
    },
    {
      actionID: 'CA-002',
      description: 'Re-train staff on adverse event reporting',
      assignedTo: 'Researcher02',
      status: 'IN_PROGRESS',
      dueDate: '2025-12-28',
    },
    {
      actionID: 'CA-003',
      description: 'Fix missing lab result entry',
      assignedTo: 'Researcher03',
      status: 'COMPLETED',
      dueDate: '2025-12-20',
    },
  ];
}
