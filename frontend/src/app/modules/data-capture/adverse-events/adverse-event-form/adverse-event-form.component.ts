
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdverseEventStore } from '../../services/adverse-event.store';
import { Severity } from '../../models';

@Component({
  selector: 'app-adverse-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './adverse-event-form.component.html',
  styleUrls: ['./adverse-event-form.component.css']
})
export class AdverseEventFormComponent {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private store: AdverseEventStore, private router: Router) {
    this.form = this.fb.group({
      ParticipantID: ['', [Validators.required]],
      Severity: ['MODERATE' as Severity, [Validators.required]],
      ReportedDate: [new Date().toISOString().substring(0,10), [Validators.required]],
      Description: ['', [Validators.required, Validators.minLength(5)]],
      ActionTaken: [''],   // optional, to match screenshot
      Outcome: ['']        // optional
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const created = this.store.add({
      ParticipantID: String(v.ParticipantID),
      Severity: String(v.Severity).toUpperCase() as Severity,
      ReportedDate: String(v.ReportedDate),
      Description: String(v.Description),
      Outcome: v.Outcome ? String(v.Outcome) : undefined,
      Status: 'OPEN'
    });
    this.router.navigate(['/data-capture/adverse-events', created.EventID]);
  }

  reset(): void {
    this.form.reset({
      ParticipantID: '',
      Severity: 'MODERATE',
      ReportedDate: new Date().toISOString().substring(0,10),
      Description: '',
      ActionTaken: '',
      Outcome: ''
    });
  }
}
