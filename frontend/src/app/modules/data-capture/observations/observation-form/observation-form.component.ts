import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ObservationService } from '../../services/observation.service';

@Component({
  selector: 'app-observation-form',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './observation-form.component.html',
  styleUrls: ['./observation-form.component.css']
})
export class ObservationFormComponent {
  model = {
    ParticipantID: '',
    ProtocolID: '',
    VisitDate: '', // bound to <input type="date"> ideally (yyyy-MM-dd)
    DataPoints: {
      Vitals: {
        bp: '',
        heartRate: undefined as number | undefined,
        temperature: undefined as number | undefined,
        spo2: undefined as number | undefined,
        respiratoryRate: undefined as number | undefined,
      },
      LabResults: {} as Record<string, any>,
    },
  };

  constructor(private svc: ObservationService, private router: Router) {}

  // // Optional: set default date to today when the component loads
  // ngOnInit(): void {
  //   if (!this.model.VisitDate) {
  //     const today = new Date();
  //     const yyyy = today.getFullYear();
  //     const mm = String(today.getMonth() + 1).padStart(2, '0');
  //     const dd = String(today.getDate()).padStart(2, '0');
  //     this.model.VisitDate = `${yyyy}-${mm}-${dd}`;
  //   }
  // }

  save(form: any): void {
    if (form.invalid) return;

    const created = this.svc.add({
      ParticipantID: this.model.ParticipantID,
      VisitDate: this.model.VisitDate,        // will be normalized in service anyway
      DataPoints: this.model.DataPoints,
    });
    this.router.navigate(['/data-capture/observations', created.ObservationID]);
  }
}
