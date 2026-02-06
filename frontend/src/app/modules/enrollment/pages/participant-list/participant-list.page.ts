import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ParticipantService } from '../../services/participant.service';
import { Participant } from '../../models/participant.model';
import { CommonModule } from '@angular/common';
import { ConsentForm } from '../../models/consent.model';
import { TrialProtocol } from '../../../protocol/models/trial-protocol.model';
import { ProtocolService } from '../../../protocol/services/protocol.service';

@Component({
  selector: 'bt-participant-list',
  templateUrl: './participant-list.page.html',
  styleUrls: ['./participant-list.page.css'],
  standalone: true,
  imports: [CommonModule]
})


export class ParticipantListPage implements OnInit {
  participants: (Participant & { latestConsent?: ConsentForm })[] = [];
  loading = true;
  protocols: TrialProtocol[] = [];

  constructor(
    private participantService: ParticipantService,
    private protocolService: ProtocolService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.participantService.list().subscribe(participants => {
      this.participants = participants;
    });
    this.protocolService.loadAll().subscribe(protocols => {
      this.protocols = protocols;
    });
  }

  getProtocolTitle(protocolId?: string): string {
    if (!protocolId) return '—';
    const proto = this.protocols.find((p: TrialProtocol) => p.protocolId === protocolId);
    return proto ? `${proto.title} (Phase ${proto.phase}, ${proto.status})` : protocolId;
  }

  private loadParticipants(): void {
    this.participantService.list().subscribe((data: Participant[]) => {
      // For each participant, fetch latest consent history
      const enriched = data.map((p: Participant) => {
        let latestConsent: ConsentForm | undefined;
        this.participantService.getConsentHistory(p.participantId).subscribe((consents: ConsentForm[]) => {
          if (consents.length > 0) {
            latestConsent = consents[consents.length - 1]; // last record
          }
        });
        return { ...p, latestConsent };
      });
      this.participants = enriched;
      this.loading = false;
    });
  }

  manageConsent(id: string): void {
    this.router.navigate(['/enrollment/consent-manage', id]);
  }

  create(): void {
    this.router.navigate(['/enrollment/participant-create']);
  }

  edit(id: string): void {
    this.router.navigate(['/enrollment/participant-create'], {
      queryParams: { id }
    });
  }

  delete(id: string): void {
    this.participantService.delete(id).subscribe(() => {
      this.loadParticipants(); // reload after deletion
    });
  }
}
