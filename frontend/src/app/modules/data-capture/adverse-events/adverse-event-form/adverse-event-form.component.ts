
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdverseEventService } from '../../services/adverse-event-service';
import { AuditService } from '../../services/audit.service';

@Component({
  selector: 'app-adverse-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './adverse-event-form.component.html',
  styleUrls: ['./adverse-event-form.component.css']
})
export class AdverseEventFormComponent {
  form!: FormGroup;
  saving = false;
  error?: string;

  // ✅ success toast state
  showSuccess = false;
  successMsg = 'Adverse event submitted successfully.';

  constructor(
    private fb: FormBuilder,
    private aeSvc: AdverseEventService,
    private router: Router,
    private audit: AuditService
  ) {
    // Initialize reactive form
    this.form = this.fb.group({
      participantId: [null, [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      severity: ['MODERATE', [Validators.required]],           // enum string
      reportedDate: [new Date().toISOString().substring(0, 10), [Validators.required]], // "yyyy-MM-dd"
      actionTaken: [''],
      outcome: ['']                                            // optional free-text
    });
  }

  submit(): void {
    this.error = undefined;

    // Block if invalid or already saving
    if (this.form.invalid || this.saving) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;

    const v = this.form.getRawValue();
    const payload = {
      participantId: v.participantId,
      description: v.description?.trim(),
      severity: v.severity?.toString().toUpperCase(),  // "MODERATE" | "MILD" | "SEVERE" | "CRITICAL"
      reportedDate: v.reportedDate,                    // "yyyy-MM-dd" → service will convert to ISO
      actionTaken: v.actionTaken?.trim(),
      outcome: v.outcome?.toString().toUpperCase()     // e.g., "RESOLVED" (optional)
    };

    // Generate a correlation/request ID for audit trail
    const correlationId = crypto.randomUUID();
    // Prepare a temporary entityId if the service doesn't return one
    const tempEntityId = `ae-${correlationId}`;

    // Save via localStorage-backed service; no backend required
    this.aeSvc.create(payload as any).subscribe({
      next: (created: any) => {
        // Stop the spinner
        this.saving = false;

        // Determine the entityId to use in audit logs
        const entityId =
          (created && (created.eventID || created.id)) ||
          tempEntityId;

        // Append CREATE audit log (frontend-only, LocalStorage)
        this.audit.append({
          entityType: 'AdverseEvent',
          entityId,
          action: 'CREATE',
          changedBy: this.getCurrentUserId(),
          changedAt: new Date().toISOString(), // UTC ISO
          source: 'WEB_UI',
          requestId: correlationId,
          newValues: created ?? payload
        }).then(() => {
          // ✅ show success toast
          this.showToast();
          // Navigate immediately (or delay slightly if you prefer)
          this.router.navigate(['/data-capture/adverse-events']);
          // Or delay navigation so the user sees the popup:
          // setTimeout(() => this.router.navigate(['/data-capture/adverse-events']), 1500);
        }).catch(() => {
          // Even if audit logging fails, continue UX flow
          this.showToast();
          this.router.navigate(['/data-capture/adverse-events']);
        });
      },
      error: (err) => {
        console.error('Failed to save adverse event:', err);
        this.error = 'Failed to save adverse event.';
        this.saving = false;
      }
    });
  }

  // ✅ simple toast helper
  private showToast(): void {
    this.showSuccess = true;
    // auto-hide after 2 seconds (only affects current page if you choose to stay)
    setTimeout(() => (this.showSuccess = false), 2000);
  }

  /**
   * Frontend-only current user resolver.
   * Replace with your Auth service if available.
   */
  private getCurrentUserId(): string {
    return localStorage.getItem('currentUserId') || 'anonymous';
  }
}
