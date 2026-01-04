import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ParticipantService } from '../../services/participant.service';
import { Participant } from '../../models/participant.model';

import { CommonModule } from '@angular/common';
@Component({
  selector: 'bt-participant-list',
  templateUrl: './participant-list.page.html',
  styleUrls: ['./participant-list.page.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ParticipantListPage {
  participants: Participant[] = [
    { 
      id: '1',
      name: 'Alice Johnson',
      dob: '1990-05-12',
      contactInfo: 'alice@example.com',
      eligibilityStatus: 'ELIGIBLE',
      consentStatus: 'SIGNED' 
    },
      
    { 
      id: '2',
      name: 'Bob Smith',
      dob: '1985-09-23',
      contactInfo: 'bob@example.com',
      eligibilityStatus: 'PENDING', 
      consentStatus: 'PENDING' }
  ];
  loading = false;

  constructor(private participantService: ParticipantService, private router: Router) {}

  ngOnInit(): void {
    this.fetchParticipants();
  }

  fetchParticipants(): void {
    this.loading = true;
    this.participantService.list().subscribe({
      next: data => { this.participants = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  create(): void {
    this.router.navigate(['/enrollment/participant-create']);
  }

  manageConsent(id: string): void {
    this.router.navigate(['/enrollment/consent-manage', id]);
  }
}
