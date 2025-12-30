
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DeviationService } from '../../services/deviation.service';
import { AuditService } from '../../services/audit.service';
import { ProtocolDeviation } from '../../models/protocol-deviation';

@Component({
  selector: 'biotrack-deviation-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deviation-detail.component.html',
  styleUrls: ['./deviation-detail.component.css']
})
export class DeviationDetailComponent implements OnInit {
  deviation?: ProtocolDeviation;
  updating = false;

  constructor(
    private route: ActivatedRoute,
    private svc: DeviationService,
    private audit: AuditService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.svc.get(id).subscribe(d => this.deviation = d);
  }

  async setStatus(status: ProtocolDeviation['status']) {
    if (!this.deviation?.deviationId) return;

    this.updating = true;

    const idFromRoute = this.route.snapshot.paramMap.get('id') ?? '';
    const before = { ...this.deviation }; // snapshot for audit

    this.svc.updateStatus(this.deviation.deviationId, status).subscribe({
      next: async (updated) => {
        this.deviation = updated;

        // Ensure entityId is a definite string
        const entityId = updated.deviationId ?? idFromRoute ?? `dev-${crypto.randomUUID()}`;

        // Optional: describe reason for change; you can wire this to a UI control
        const reason = `Status changed to ${status}`;

        // Append an UPDATE audit log (frontend-only, LocalStorage)
        await this.audit.append({
          entityType: 'ProtocolDeviation',       // ✅ valid AuditEntityType
          entityId,                              // ✅ guaranteed string
          action: 'UPDATE',
          changedBy: this.getCurrentUserId(),
          changedAt: new Date().toISOString(),   // UTC
          source: 'WEB_UI',
          reason,
          oldValues: before,
          newValues: updated
        });

        this.updating = false;
      },
      error: () => {
        this.updating = false;
      }
    });
  }

  /**
   * Frontend-only current user resolver.
   * Replace with your Auth service if available.
   */
  private getCurrentUserId(): string {
    return localStorage.getItem('currentUserId') || 'anonymous';
  }
}
