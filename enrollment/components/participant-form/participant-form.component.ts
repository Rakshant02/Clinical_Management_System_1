import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Participant } from '../../models/participant.model';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'bt-participant-form',
  templateUrl: './participant-form.component.html',
  styleUrls: ['./participant-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ParticipantFormComponent {
  @Input() initialValue?: Participant;
  @Output() submitForm = new EventEmitter<Participant>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      dob: ['', Validators.required],
      contactInfo: ['', [Validators.required, Validators.email]],
      eligibilityStatus: ['PENDING'],
      consentStatus: ['PENDING']
    });
  }

  ngOnInit(): void {
    if (this.initialValue) this.form.patchValue(this.initialValue);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitForm.emit(this.form.value);
    }
  }
}
