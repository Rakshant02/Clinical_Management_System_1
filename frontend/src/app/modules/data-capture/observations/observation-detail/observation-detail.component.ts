
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ObservationService } from '../../services/observation.service';
import { AuditPanelComponent } from '../../audit/audit-panel.component';

@Component({
  selector: 'app-observation-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, AuditPanelComponent],
  templateUrl: './observation-detail.component.html',
  styleUrls: ['./observation-detail.component.css']
})
export class ObservationDetailComponent implements OnInit {
  obs: any;
  vitalsRows: { label: string; value: any }[] = [];
  labRows: { test: string; value: any }[] = [];

  constructor(private route: ActivatedRoute, private svc: ObservationService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.obs = id ? this.svc.find(id) : undefined;

    if (this.obs?.DataPoints?.Vitals) {
      const v = this.obs.DataPoints.Vitals;
      this.vitalsRows = [
        { label: 'BP', value: v.bp ?? '—' },
        { label: 'Heart Rate', value: v.heartRate ?? '—' },
        { label: 'Temperature', value: v.temperature ?? '—' },
        { label: 'SpO₂', value: v.spo2 ?? '—' },
        { label: 'Respiratory Rate', value: v.respiratoryRate ?? '—' }
      ];
    }

    if (this.obs?.DataPoints?.LabResults) {
      const labs = this.obs.DataPoints.LabResults;
      this.labRows = Object.entries(labs).map(([k, val]) => ({ test: k, value: val ?? '—' }));
    }
  }
}