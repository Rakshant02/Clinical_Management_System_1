
import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuditService } from '../../services/audit.service';
import { DeviationService } from '../../services/deviation.service';
import { ProtocolDeviation } from '../../models/protocol-deviation';

@Component({
  selector: 'biotrack-deviation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, DatePipe],
  templateUrl: './deviation-form.component.html',
  styleUrls: ['./deviation-form.component.css']
})
export class DeviationFormComponent {
  form!: FormGroup;
  saving = false;
  error?: string;

  // ✅ success toast state
  showSuccess = false;
  successMsg = 'Protocol deviation created successfully.';

  constructor(
    private fb: FormBuilder,
    private deviationSvc: DeviationService,
    private audit: AuditService,
    private router: Router
  ) {
    // Initialize reactive form to match your HTML controls
    this.form = this.fb.group({
      protocolId: ['', [Validators.required]],
      participantId: ['', [Validators.required]],
      observationId: [''], // optional
      description: ['', [Validators.required, Validators.minLength(10)]],
      severity: ['MINOR', [Validators.required]],
      detectedBy: ['', [Validators.required]],
      reportedDate: [new Date().toISOString()] // we’ll format to datetime-local in template
      // siteId: [''] // If you want it here, add input in the template too
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

    // Payload shape aligned to the updated ProtocolDeviation model
    const payload: ProtocolDeviation = {
      deviationId: undefined, // service will assign
      protocolId: (v.protocolId ?? '').trim(),
      participantId: (v.participantId ?? '').toString().trim(),
      observationId: v.observationId?.toString().trim() || undefined,
      description: (v.description ?? '').trim(),
      severity: (v.severity ?? 'MINOR').toString().toUpperCase() as ProtocolDeviation['severity'],
      status: 'OPEN', // default status on create
      detectedBy: (v.detectedBy ?? '').trim(),
      reportedDate: v.reportedDate // DeviationService.normalizeDate will convert to ISO
      // siteId: v.siteId?.trim() || undefined // include if present in form
    };

    const requestId = crypto.randomUUID();
    const tempId = `dev-${requestId}`; // ✅ guaranteed string fallback

    this.deviationSvc.create(payload).subscribe({
      next: async (created) => {
        // Stop spinner
        this.saving = false;

        // ✅ Ensure entityId is a definite string
        const entityId: string = created?.deviationId ?? tempId;

        // Append CREATE audit log (frontend-only, LocalStorage)
        await this.audit.append({
          entityType: 'ProtocolDeviation',
          entityId,
          action: 'CREATE',
          changedBy: this.getCurrentUserId(),
          changedAt: new Date().toISOString(), // UTC ISO
          source: 'WEB_UI',
          requestId,
          newValues: created ?? payload
        });

        // ✅ show success toast
        this.showToast();

        // Navigate to list
        this.router.navigate(['/data-capture/protocol-deviation']);
      },
      error: (err) => {
        console.error('Failed to create protocol deviation:', err);
        this.error = 'Failed to create protocol deviation.';
        this.saving = false;
      }
    });
  }

  // ✅ simple toast helper
  private showToast(): void {
    this.showSuccess = true;
    // auto-hide after 2 seconds
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
