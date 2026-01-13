
import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AuditService, AuditLog } from '../services/audit.service';

@Component({
  selector: 'bt-audit-log-page',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.css']
})
export class AuditLogComponent {
  logs: AuditLog[] = [];
  counts = { observations: 0, adverseEvents: 0, deviations: 0 };

  constructor(private audit: AuditService) {
    this.refresh();
  }

  refresh(): void {
    this.logs = this.audit.getRecent(50);
    this.counts = this.computeCounts(this.logs);
  }

  trackByKey(_: number, l: AuditLog): string {
    // Hash preferred; fallback ensures stable trackBy
    return l.hash ?? `${l.entityType}#${l.entityId}#${l.changedAt}#${l.action}`;
  }

  private computeCounts(list: AuditLog[]) {
    let observations = 0, adverseEvents = 0, deviations = 0;
    for (const x of list) {
      const t = (x.entityType || '').toLowerCase();
      if (t.includes('observation')) observations++;
      else if (t.includes('adverse') || t.includes('ae')) adverseEvents++;
      else if (t.includes('deviation')) deviations++;
    }
    return { observations, adverseEvents, deviations };
  }
}
