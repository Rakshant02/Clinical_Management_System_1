
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, NgClass, DatePipe, JsonPipe, SlicePipe } from '@angular/common';
import { AuditService, AuditLog, AuditEntityType } from '../../services/audit.service';
import { exportAuditCsv, exportAuditJson } from '../../services/audit-export.util';

@Component({
  selector: 'bt-audit-panel',
  standalone: true,
  // ✅ Import the directives + pipes used in the HTML
  imports: [
    CommonModule,      // includes *ngIf, *ngFor, etc.
    NgClass,           // for [ngClass]
    DatePipe,          // for | date
    JsonPipe,          // for | json
    SlicePipe          // for | slice
  ],
  templateUrl: './audit-panel.component.html',
  styleUrls: ['./audit-panel.component.scss']
})
export class AuditPanelComponent implements OnInit {
  @Input({ required: true }) entityType!: AuditEntityType;
  @Input({ required: true }) entityId!: string;

  logs: AuditLog[] = [];
  verifying = false;
  verifyStatus: { ok: boolean; brokenAt?: string } | null = null;

  constructor(private audit: AuditService) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.logs = this.audit.getByEntity(this.entityType, this.entityId);
    this.verifyStatus = null;
  }

  async verifyChain(): Promise<void> {
    this.verifying = true;
    this.verifyStatus = await this.audit.verifyChain(this.entityType, this.entityId);
    this.verifying = false;
  }

  exportCsv(): void {
    exportAuditCsv(this.logs, `${this.entityType}_${this.entityId}_audit.csv`);
  }

  exportJson(): void {
    exportAuditJson(this.logs, `${this.entityType}_${this.entityId}_audit.json`);
  }
}
