
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DeviationService } from '../../services/deviation.service';
import { ProtocolDeviation } from '../../models';

@Component({
  selector: 'biotrack-deviation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './deviation-form.component.html',
  styleUrls: ['./deviation-form.component.css']
})
export class DeviationFormComponent {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private svc: DeviationService, private router: Router) {
    // Initialize with sensible defaults + placeholders in HTML
    this.form = this.fb.group({
      ProtocolID: ['', [Validators.required]],
      ParticipantID: ['', [Validators.required]],
      ObservationID: [''], // optional
      Description: ['', [Validators.required, Validators.minLength(10)]],
      Severity: ['MINOR' as ProtocolDeviation['Severity'], [Validators.required]],
      DetectedBy: ['', [Validators.required]],
      ReportedDate: [new Date().toISOString().slice(0,16), [Validators.required]] // yyyy-MM-ddTHH:mm
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const created = this.svc.create({
      ProtocolID: v.ProtocolID.trim(),
      ParticipantID: v.ParticipantID.trim(),
      ObservationID: v.ObservationID?.trim() || undefined,
      Description: v.Description.trim(),
      Severity: v.Severity,
      DetectedBy: v.DetectedBy.trim(),
      ReportedDate: toISO(v.ReportedDate),
      Status: 'OPEN'
    });
    this.router.navigate(['/data-capture/deviations', created.DeviationID]);
  }
}

function toISO(input: string): string {
  try { return new Date(input).toISOString(); } catch { return new Date().toISOString(); }
}
