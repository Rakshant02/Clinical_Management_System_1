import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Participant } from '../../models/participant.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'bt-participant-form',
  templateUrl: './participant-form.component.html',
  styleUrls: ['./participant-form.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ParticipantFormComponent {
  
  @Input() participant: Participant = {
    id: '',
    name: '',
    dob: '',
    contactInfo: '',
    eligibilityStatus: '',
    enrollmentStatus: 'PENDING'
  };

  @Output() saveParticipant = new EventEmitter<Participant>();

  
  // ✅ Eligibility validation: must be 18+
  private validateEligibility(participant: Participant): boolean {
    if (!participant.dob) return false;
    const dob = new Date(participant.dob);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age >= 18;
  }

  onSubmit(): void {
    if (!this.validateEligibility(this.participant)) {
      alert('Participant not eligible (must be 18+).');
      this.participant.eligibilityStatus = 'Ineligible';
      return;
    }

    this.participant.eligibilityStatus = 'Eligible';
    this.saveParticipant.emit(this.participant);
  }
}
