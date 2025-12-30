import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'bt-consent-form',
  templateUrl: './consent-form.component.html',
  styleUrls: ['./consent-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ConsentFormComponent {
  @Input() participantName?: string;
  @Output() signConsent = new EventEmitter<{ agree: boolean; signatureData: string }>();
  @Output() withdrawConsent = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      agree: [false, Validators.requiredTrue],
      signatureData: ['', Validators.required]
    });
  }

  onSign(): void {
    if (this.form.valid) {
      this.signConsent.emit(this.form.value);
    }
  }

  onWithdraw(): void {
    this.withdrawConsent.emit();
  }
}
