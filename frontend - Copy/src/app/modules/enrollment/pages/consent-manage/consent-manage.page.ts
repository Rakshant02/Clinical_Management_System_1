import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParticipantService } from '../../services/participant.service';
import { Participant } from '../../models/participant.model';
import { CommonModule } from '@angular/common';
import { ConsentFormComponent } from '../../components/consent-form/consent-form.component';
import { ConsentForm } from '../../models/consent.model';

@Component({
  selector: 'bt-consent-manage',
  templateUrl: './consent-manage.page.html',
  styleUrls: ['./consent-manage.page.css'],
  standalone: true,
  imports: [CommonModule, ConsentFormComponent]
})

export class ConsentManagePage implements OnInit {
  participant?: Participant;
  consentHistory: ConsentForm[] = [];

  constructor(
    private route: ActivatedRoute,
    private participantService: ParticipantService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.participantService.get(id).subscribe(p => this.participant = p);
      this.loadConsentHistory(id);
    }
  }

  private loadConsentHistory(participantId: string): void {
    this.participantService.getConsentHistory(participantId).subscribe(history => {
      this.consentHistory = history;
    });
  }

  signConsent(): void {
    if (!this.participant) return;
    this.participantService.signConsent(this.participant.id).subscribe(() => {
      this.loadConsentHistory(this.participant!.id);
    });
  }

  withdrawConsent(): void {
    if (!this.participant) return;
    this.participantService.withdrawConsent(this.participant.id).subscribe(() => {
      this.loadConsentHistory(this.participant!.id);
    });
  }
}
