import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-corrective-action',
  imports: [CommonModule, MatTableModule],
  standalone:true,
  templateUrl: './corrective-action.component.html',
  styleUrl: './corrective-action.component.css',
})
export class CorrectiveActionComponent {
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
