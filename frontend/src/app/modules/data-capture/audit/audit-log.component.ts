
// import { Component } from '@angular/core';
// import { CommonModule, DatePipe } from '@angular/common';
// import { AuditService, AuditLog } from '../services/audit.service';

// @Component({
//   selector: 'bt-audit-log-page',
//   standalone: true,
//   imports: [CommonModule, DatePipe],
//   templateUrl: './audit-log.component.html',
//   styleUrls: ['./audit-log.component.css']
// })
// export class AuditLogComponent {
//   logs: AuditLog[] = [];
//   counts = { observations: 0, adverseEvents: 0, deviations: 0 };

//   constructor(private audit: AuditService) {
//     this.refresh();
//   }

//   refresh(): void {
//     this.logs = this.audit.getRecent(50);
//     this.counts = this.computeCounts(this.logs);
//   }

//   trackByKey(_: number, l: AuditLog): string {
//     // Hash preferred; fallback ensures stable trackBy
//     return l.hash ?? `${l.entityType}#${l.entityId}#${l.changedAt}#${l.action}`;
//   }

//   private computeCounts(list: AuditLog[]) {
//     let observations = 0, adverseEvents = 0, deviations = 0;
//     for (const x of list) {
//       const t = (x.entityType || '').toLowerCase();
//       if (t.includes('observation')) observations++;
//       else if (t.includes('adverse') || t.includes('ae')) adverseEvents++;
//       else if (t.includes('deviation')) deviations++;
//     }
//     return { observations, adverseEvents, deviations };
//   }
// }
import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditService, AuditLog } from '../services/audit.service';

@Component({
  selector: 'bt-audit-log-page',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.css']
})
export class AuditLogComponent {
  /** Full list fetched once */
  private allLogs: AuditLog[] = [];

  /** Displayed list (search results or today's) */
  logs: AuditLog[] = [];

  /** Counts computed from displayed list */
  counts = { observations: 0, adverseEvents: 0, deviations: 0 };

  /** Search model */
  search = {
    entity: '',        // free text, case-insensitive, matches entityType
    date: '' as string // HTML date input format: 'YYYY-MM-DD'
  };

  constructor(private audit: AuditService) {
    this.refresh();
  }

  /** Whether any search filter is active */
  get isSearching(): boolean {
    return (this.search.entity?.trim()?.length ?? 0) > 0 || !!this.search.date;
  }

  refresh(): void {
    // Increase cap if needed
    this.allLogs = this.audit.getRecent(200);
    this.applyView(); // sets today's or search results
  }

  /** TrackBy as-is from your code */
  trackByKey(_: number, l: AuditLog): string {
    return l.hash ?? `${l.entityType}#${l.entityId}#${l.changedAt}#${l.action}`;
  }

  /** Search handlers */
  onSearchChange(): void {
    this.applyView();
  }

  clearSearch(): void {
    this.search.entity = '';
    this.search.date = '';
    this.applyView();
  }

  /** Apply either search filters or today's default view (local day) */
  private applyView(): void {
    let list = this.allLogs;

    if (this.isSearching) {
      const entity = (this.search.entity || '').trim().toLowerCase();
      const dateStr = (this.search.date || '').trim(); // 'YYYY-MM-DD'

      list = list.filter(l => {
        const entityOk = entity ? (l.entityType || '').toLowerCase().includes(entity) : true;
        const dateOk = dateStr ? this.isSameLocalDay(l.changedAt, new Date(dateStr)) : true;
        return entityOk && dateOk;
      });
    } else {
      const today = new Date();
      list = list.filter(l => this.isSameLocalDay(l.changedAt, today));
    }

    this.logs = list;
    this.counts = this.computeCounts(this.logs);
  }

  /** Counts logic unchanged */
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

  /** Compare two dates by local calendar day */
  private isSameLocalDay(a: Date | string | number, b: Date): boolean {
    const da = new Date(a);
    return da.getFullYear() === b.getFullYear()
        && da.getMonth() === b.getMonth()
        && da.getDate() === b.getDate();
  }
}
