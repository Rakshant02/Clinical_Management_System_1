// C:\Users\2460697\source\repos\Angular\Project\biotrack-frontend\src\app\components\consent-form\consent-form.component.ts

import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Participant } from '../../models/participant.model';
import { ConsentForm } from '../../models/consent.model';

@Component({
  selector: 'bt-consent-form',
  templateUrl: './consent-form.component.html',
  styleUrls: ['./consent-form.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ConsentFormComponent {
  @Input() participant: Participant | null = null;
  @Input() consentHistory: ConsentForm[] = [];

  @Output() consentSigned = new EventEmitter<string>();     // emit participantId
  @Output() consentWithdrawn = new EventEmitter<string>();  // emit participantId

  sign(): void {
    if (this.participant) {
      this.consentSigned.emit(this.participant.id);
    }
  }

  withdraw(): void {
    if (this.participant) {
      this.consentWithdrawn.emit(this.participant.id);
    }
  }
}
