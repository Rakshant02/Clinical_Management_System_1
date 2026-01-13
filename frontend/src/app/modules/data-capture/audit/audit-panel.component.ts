
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe, JsonPipe } from '@angular/common';
import { AuditService, AuditEntityType, AuditLog } from '../services/audit.service';

@Component({
  selector: 'bt-audit-panel',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="audit-panel">
      <div class="hdr">
        <strong>Audit Trail:</strong> {{entityType}} • {{entityId}}
        <button (click)="refresh()">Refresh</button>
        <button (click)="verifyChain()">{{ verifying ? 'Verifying…' : 'Verify Chain' }}</button>
      </div>

      <div *ngIf="verifyStatus">
        <span *ngIf="verifyStatus.ok" style="color:green">Hash chain intact ✓</span>
        <span *ngIf="!verifyStatus.ok" style="color:red">Hash chain broken at Log {{ verifyStatus?.brokenAt }} ✗</span>
      </div>

      <div *ngIf="logs.length; else empty">
        <div class="log" *ngFor="let log of logs">
          <div class="meta">
            <b>{{ log.action }}</b> • {{ log.changedAt | date:'medium' }} by {{ log.changedBy }}
            <small>Req: {{ log.requestId }}</small>
          </div>
          <div *ngIf="log.reason">Reason: {{ log.reason }}</div>
          <pre *ngIf="log.oldValues">Old: {{ log.oldValues | json }}</pre>
          <pre *ngIf="log.newValues">New: {{ log.newValues | json }}</pre>
          <small>hash: {{ log.hash.slice(0, 16) }}… • prev: {{ (log.prevHash ?? '')?.slice(0, 16) }}…</small>
        </div>
      </div>
      <ng-template #empty><p>No audit records yet.</p></ng-template>
    </div>
  `,
  styles: [`.audit-panel{border:1px solid #ddd;padding:8px;border-radius:6px}.log{margin:8px 0;padding:6px;border:1px dashed #ccc}`]
})
export class AuditPanelComponent implements OnInit {
  @Input({ required: true }) entityType!: AuditEntityType;
  @Input({ required: true }) entityId!: string;

  logs: AuditLog[] = [];
  verifying = false;
  verifyStatus: { ok: boolean; brokenAt?: string } | null = null;

  constructor(private audit: AuditService) {}

  ngOnInit(): void { this.refresh(); }

  refresh(): void {
    this.logs = this.audit.getByEntity(this.entityType, this.entityId);
    this.verifyStatus = null;
  }

  async verifyChain(): Promise<void> {
    this.verifying = true;
    this.verifyStatus = await this.audit.verifyChain(this.entityType, this.entityId);
    this.verifying = false;
  }
}