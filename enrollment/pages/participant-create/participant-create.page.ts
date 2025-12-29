import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ParticipantService } from '../../services/participant.service';
import { Participant } from '../../models/participant.model';

import { CommonModule } from '@angular/common';
import { ParticipantFormComponent } from '../../components/participant-form/participant-form.component';
@Component({
  selector: 'bt-participant-create',
  templateUrl: './participant-create.page.html',
  styleUrls: ['./participant-create.page.css'],
  standalone: true,
  imports: [CommonModule, ParticipantFormComponent]
})
export class ParticipantCreatePage {
  constructor(private participantService: ParticipantService, private router: Router) {}

  onSubmit(participant: Participant): void {
    this.participantService.create(participant).subscribe({
      next: p => this.router.navigate(['/enrollment/consent-manage', p.id])
    });
  }

  cancel(): void {
    this.router.navigate(['/enrollment/participant-list']);
  }
}
