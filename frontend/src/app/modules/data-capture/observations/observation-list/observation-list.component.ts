import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ObservationService } from '../../services/observation.service';
import { Observation } from '../../models';
import { IfRoleDirective } from '../../../../shared/directives/if-role.directive';

@Component({
  selector: 'app-observation-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, IfRoleDirective],
  templateUrl: './observation-list.component.html',
  styleUrls: ['./observation-list.component.css']
})
export class ObservationListComponent implements OnInit {
  participantFilter = '';
  list: Observation[] = [];

  constructor(private svc: ObservationService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const pid = this.route.snapshot.queryParamMap.get('pid');
    if (pid) this.participantFilter = pid;

    // ✅ Call the signal function to get the array
    const all = this.svc.listSig();

    this.list = this.participantFilter
      ? all.filter((o: Observation) => o.ParticipantID === this.participantFilter)
      : all;
  }

  applyFilter(): void {
    const extras = this.participantFilter
      ? { queryParams: { pid: this.participantFilter } }
      : { queryParams: {} };
    this.router.navigate(['/data-capture/observations'], extras);

    // ✅ Re-read the signal
    const all = this.svc.listSig();

    this.list = this.participantFilter
      ? all.filter((o: Observation) => o.ParticipantID === this.participantFilter)
      : all;
  }
}
