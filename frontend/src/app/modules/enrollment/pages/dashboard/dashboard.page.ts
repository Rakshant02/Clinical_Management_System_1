import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ParticipantService } from '../../services/participant.service';
import { Participant } from '../../models/participant.model';
import { CommonModule } from '@angular/common';
import { ConsentForm } from '../../models/consent.model';

@Component({
  selector: 'bt-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DashboardPage {
  participants: Participant[] = [];
  totalParticipants = 0;
  enrolledCount = 0;
  signedConsents = 0;
  withdrawnCount = 0;

  constructor( 
    private participantService: ParticipantService, 
    private router: Router ) 
  {}

 

  ngOnInit(): void {
    // Load participants
    this.participantService.list().subscribe((participants: Participant[]) => {
      this.totalParticipants = participants.length;
      this.enrolledCount = participants.filter(p => p.enrollmentStatus === 'ENROLLED').length;
      this.withdrawnCount = participants.filter(p => p.enrollmentStatus === 'WITHDRAWN').length;
    });

    // Load consents
    // If you want total signed consents across all participants:
    this.participantService.list().subscribe((participants: Participant[]) => {
      let signed = 0;
      participants.forEach(p => {
        this.participantService.getConsentHistory(p.id).subscribe((consents: ConsentForm[]) => {
          signed += consents.filter(c => c.status === 'SIGNED').length;
          this.signedConsents = signed;
        });
      });
    });
  }

  // Navigation actions
  goToParticipants(): void {
    this.router.navigate(['/enrollment/participant-list']);
  }

  goToCreate(): void {
    this.router.navigate(['/enrollment/participant-create']);
  }
}

