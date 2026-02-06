 
// consent-form.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ConsentForm } from '../../models/consent.model';
import { Participant } from '../../models/participant.model';
 
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
  @Output() consentSigned = new EventEmitter<string>();  
  @Output() consentWithdrawn = new EventEmitter<string>();
 
  // Latest consent record convenience getter
  get latest(): ConsentForm | undefined {
    return this.consentHistory?.length
      ? this.consentHistory[this.consentHistory.length - 1]
      : undefined;
  }
 
  // Rule: allow Sign if no history OR latest is WITHDRAWN AND there was no prior SIGNED
  get canSign(): boolean {
    if (!this.participant) return false;
    if (!this.latest) return true; // first ever sign
    if (this.latest.status === 'WITHDRAWN') {
      const signedBefore = this.consentHistory.some(c => c.status === 'SIGNED');
      return !signedBefore; // only one re-sign permitted after a withdrawal
    }
    return false; // latest is SIGNED -> cannot re-sign
  }
 
  // Rule: withdraw is disabled if latest is SIGNED or WITHDRAWN (i.e., never after signing,
  // and no consecutive withdrawals). You can choose whether to allow first-time withdraw.
  get canWithdraw(): boolean {
    if (!this.participant) return false;
    if (!this.latest) return true; // allow initial withdraw if you need that path
    return this.latest.status !== 'SIGNED' && this.latest.status !== 'WITHDRAWN';
  }
 
  sign(): void {
    if (this.participant && this.canSign) {
      this.consentSigned.emit(this.participant.participantId);
    }
  }
 
  withdraw(): void {
    if (this.participant && this.canWithdraw) {
      this.consentWithdrawn.emit(this.participant.participantId);
    }
  }
}