import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private participantService: ParticipantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.participantService.get(id).subscribe(p => {
        // normalize the returned participant shape to the core Participant interface
        const src: any = p as any;
        this.participant = {
          participantId: src.participantId ?? src.id,
          name: src.name,
          dob: src.dob,
          contactInfo: src.contactInfo,
          eligibilityStatus: src.eligibilityStatus,
          enrollmentStatus: src.enrollmentStatus
        } as Participant;
      });
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
    this.participantService.signConsent(this.participant.participantId).subscribe(() => {
      this.loadConsentHistory(this.participant!.participantId);
    });
    this.router.navigate(['/enrollment/participant-list']);
  }

  withdrawConsent(): void {
    if (!this.participant) return;
    this.participantService.withdrawConsent(this.participant.participantId).subscribe(() => {
      this.loadConsentHistory(this.participant!.participantId);
    });
    this.router.navigate(['/enrollment/participant-list']);
  }
  
}
