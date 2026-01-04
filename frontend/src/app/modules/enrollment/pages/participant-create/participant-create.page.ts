// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { ParticipantService } from '../../services/participant.service';
// import { Participant } from '../../models/participant.model';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'bt-participant-create',
//   templateUrl: './participant-create.page.html',
//   styleUrls: ['./participant-create.page.css'],
//   standalone: true,
//   imports: [CommonModule, FormsModule]
// })
// export class ParticipantCreatePage {
//   participant: Participant = {
//     id: '',
//     name: '',
//     dob: '',
//     contactInfo: '',
//     eligibilityStatus: '',
//     consentStatus: 'PENDING'
//   };

//   constructor(private participantService: ParticipantService, private router: Router) {}

//   save(): void {
//     this.participantService.create(this.participant).subscribe({
//       next: (p: Participant) => this.router.navigate(['/enrollment/consent-manage', p.id]),
//       error: () => { /* handle error */ }
//     });
//   }
// }
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

  handleSave(participant: Participant): void {
    this.participantService.create(participant).subscribe({
      next: (p: Participant) => this.router.navigate(['/enrollment/consent-manage', p.id]),
      error: () => { /* handle error */ }
    });
  }
}
