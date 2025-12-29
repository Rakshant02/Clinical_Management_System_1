import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConsentService } from '../../services/consent.service';
import { ParticipantService } from '../../services/participant.service';
import { Participant } from '../../models/participant.model';
import { ConsentForm } from '../../models/consent.model';

import { CommonModule } from '@angular/common';
import { ConsentFormComponent } from '../../components/consent-form/consent-form.component';
@Component({
  selector: 'bt-consent-manage',
  templateUrl: './consent-manage.page.html',
  styleUrls: ['./consent-manage.page.css'],
  standalone: true,
  imports: [CommonModule, ConsentFormComponent]
})
export class ConsentManagePage {
  participant?: Participant;
  consent?: ConsentForm;
  loading = true;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    private participantService: ParticipantService,
    private consentService: ConsentService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.participantService.get(id).subscribe({
      next: (p) => { this.participant = p; },
      error: () => { this.error = 'Failed to load participant'; }
    });

    this.consentService.getByParticipant(id).subscribe({
      next: (c) => { this.consent = c; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onSign(event: { agree: boolean; signatureData: string }): void {
    if (!this.participant?.id) return;
    this.consentService.sign({ participantId: this.participant.id, signatureData: event.signatureData }).subscribe({
      next: (c) => { this.consent = c; },
      error: () => { this.error = 'Failed to sign consent'; }
    });
  }

  onWithdraw(): void {
    if (!this.participant?.id) return;
    this.consentService.withdraw(this.participant.id).subscribe({
      next: (c) => { this.consent = c; },
      error: () => { this.error = 'Failed to withdraw consent'; }
    });
  }
}
