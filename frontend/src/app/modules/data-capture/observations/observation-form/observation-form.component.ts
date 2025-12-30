
import { Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataCaptureService } from '../../services/data-capture.service';
import { AuditService } from '../../services/audit.service';

@Component({
  selector: 'app-observation-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgFor],
  templateUrl: './observation-form.component.html',
  styleUrls: ['./observation-form.component.css']
})
export class ObservationFormComponent {
  // Inject services
  private fb = inject(FormBuilder);
  private data = inject(DataCaptureService);
  private router = inject(Router);
  private audit = inject(AuditService);

  // UI state
  isSubmitting = false;

  // Reactive form model
  form = this.fb.group({
    participantID: ['', Validators.required],
    visitDate: ['', Validators.required],
    dataPoints: this.fb.array<FormGroup>([])
  });

  get dataPoints(): FormArray<FormGroup> {
    return this.form.get('dataPoints') as FormArray<FormGroup>;
  }

  constructor() {
    // Pre-seed common vitals
    this.addDataPoint({ code: 'HR', label: 'Heart Rate', value: '', unit: 'bpm' });
    this.addDataPoint({ code: 'BP', label: 'Blood Pressure', value: '', unit: 'mmHg' });
    // Optional: temperature
    this.addDataPoint({ code: 'TEMP', label: 'Temperature', value: '', unit: '°C' });
  }

  /**
   * Add a new dynamic data point row
   */
  addDataPoint(dp?: { code?: string; label?: string; value?: number | string; unit?: string }) {
    this.dataPoints.push(
      this.fb.group({
        code: [dp?.code ?? '', Validators.required],
        label: [dp?.label ?? '', Validators.required],
        value: [dp?.value ?? '', Validators.required],
        unit: [dp?.unit ?? '']
      })
    );
  }

  /**
   * Remove a data point row
   */
  removeDataPoint(i: number) {
    this.dataPoints.removeAt(i);
  }

  /**
   * Build the observation payload your DataCaptureService expects.
   */
  private buildObservationPayload() {
    const payload = this.form.value;

    // Flatten dynamic datapoints into a vitals object (HR/BP/TEMP, etc.)
    const vitals: Record<string, number | string> = {};
    for (const grp of this.dataPoints.controls) {
      const { code, value } = grp.value as any;
      if (code) vitals[code] = value;
    }

    // Shape used by your service
    const observation = {
      participantID: payload.participantID!,
      visitDate: payload.visitDate!,
      dataPoints: {
        vitals: {
          bp: (vitals['BP'] as string) ?? '',
          heartRate: Number(vitals['HR']) || undefined,
          temperature: Number(vitals['TEMP']) || undefined
        },
        labResults: {}
      }
    };

    return observation;
  }

  /**
   * Simple current user resolver (frontend-only).
   * Replace with your Auth service if available.
   */
  private getCurrentUserId(): string {
    return localStorage.getItem('currentUserId') || 'anonymous';
  }

  /**
   * Submit handler: saves via DataCaptureService and appends a CREATE audit log.
   */
  submit() {
    if (this.form.invalid || this.isSubmitting) return;
    this.isSubmitting = true;

    const observationPayload = this.buildObservationPayload();

    // Generate a correlation ID (same format your interceptor would use)
    const correlationId = crypto.randomUUID();
    // Prepare a temporary entityId in case backend doesn't return an observationID
    const tempEntityId = `obs-${correlationId}`;

    this.data.createObservation(observationPayload).subscribe({
      next: (created: any) => {
        // Prefer ID returned from backend; else temp ID
        const entityId =
          (created && (created.observationID || created.id)) ||
          tempEntityId;

        // Append audit log (frontend-only, LocalStorage)
        this.audit.append({
          entityType: 'Observation',
          entityId,
          action: 'CREATE',
          changedBy: this.getCurrentUserId(),
          changedAt: new Date().toISOString(), // UTC
          source: 'WEB_UI',
          requestId: correlationId,
          newValues: created ?? observationPayload
        }).then(() => {
          this.isSubmitting = false;
          this.router.navigateByUrl('/data-capture/observations');
        }).catch(() => {
          // Even if audit fails, proceed with navigation
          this.isSubmitting = false;
          this.router.navigateByUrl('/data-capture/observations');
        });
      },
      error: (err) => {
        console.error('Failed to create observation', err);
        this.isSubmitting = false;
      }
    });
  }
}
