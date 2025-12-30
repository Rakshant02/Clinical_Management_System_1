
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdverseEventService } from '../services/adverse-event-service';
import { ObservationService } from '../services/observation.service';
import { AuditService, AuditLog } from '../services/audit.service';

@Component({
  selector: 'biotrack-data-capture-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './data-capture-dashboard.component.html',
  styleUrls: ['./data-capture-dashboard.component.css']
})
export class DataCaptureDashboardComponent implements OnInit {
  observationsToday = 0;
  openAdverseEvents = 0;
  severeCritical = 0;
  lastUpdated: Date = new Date();

  auditLogs: AuditLog[] = [];
  counts = { Observation: 0, AdverseEvent: 0, ProtocolDeviation: 0 };

  private aeSvc = inject(AdverseEventService);
  private obsSvc = inject(ObservationService);
  private audit = inject(AuditService);

  ngOnInit(): void {
    this.refreshKpis();
    // Seed dummy logs only if empty (DEV only)
    const raw = localStorage.getItem('biotrack.audit.logs') ?? '[]';
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        this.audit.seedDummyLogs().then(() => this.refreshAudit());
      } else {
        this.refreshAudit();
      }
    } catch {
      this.audit.clearAll();
      this.audit.seedDummyLogs().then(() => this.refreshAudit());
    }
  }

  private refreshKpis(): void {
    const today = new Date();
    this.obsSvc.list().subscribe({
      next: (obs: any[]) => {
        this.observationsToday = (obs ?? []).filter(o => isSameLocalDay(o?.visitDate, today)).length;
        this.lastUpdated = new Date();
      }, error: () => this.lastUpdated = new Date()
    });

    this.aeSvc.list().subscribe({
      next: (aes: any[]) => {
        const list = aes ?? [];
        this.openAdverseEvents = list.filter(a => a?.status === 'OPEN').length;
        this.severeCritical = list.filter(a => a?.severity === 'SEVERE' || a?.severity === 'CRITICAL').length;
        this.lastUpdated = new Date();
      }, error: () => this.lastUpdated = new Date()
    });
  }

  refreshAudit(): void {
    this.auditLogs = this.audit.getRecent(10);
    this.counts = this.audit.getCountsByEntity();
  }
}

function isSameLocalDay(dateLike: any, ref: Date): boolean {
  if (!dateLike) return false;
  const d = new Date(dateLike);
  return d.getFullYear() === ref.getFullYear()
      && d.getMonth() === ref.getMonth()
      && d.getDate() === ref.getDate();
}
