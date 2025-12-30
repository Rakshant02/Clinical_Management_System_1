
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { JsonPipe, CommonModule } from '@angular/common';

interface Observation {
  observationId: number;
  participantId: number;
  visitDate: string;
  dataPoints?: {
    vitals?: {
      heartRate?: number;
      bloodPressure?: string;
      temperature?: number;
      respiratoryRate?: number;
      spo2?: number;
    };
    labResults?: Record<string, string | number>;
  };
  createdBy?: string;
  createdAt?: string;
}

@Component({
  selector: 'app-observation-detail',
  standalone: true,
  imports: [CommonModule, JsonPipe],
  templateUrl: './observation-detail.component.html',
  styleUrls: ['./observation-detail.component.scss']
})
export class ObservationDetailComponent implements OnInit {
  private BASE_URL = 'http://localhost:8080/api';

  loading = true;
  error?: string;
  observation?: Observation;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.error = 'Invalid Observation ID.'; this.loading = false; return; }

    this.http.get<Observation>(`${this.BASE_URL}/observations/${id}`).subscribe({
      next: obs => { this.observation = obs; this.loading = false; },
      error: () => { this.error = 'Failed to load observation.'; this.loading = false; }
    });
  }
}