
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';   // ✅ ngClass, *ngIf, *ngFor, pipes
import { RouterModule } from '@angular/router';



type Severity = 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL';

interface AdverseEvent {
  eventId: number;
  participantId: number;
  description: string;
  severity: Severity;
  reportedDate: string;
  actionTaken?: string;
  outcome?: string;
  createdBy?: string;
  createdAt?: string;
}

@Component({
  selector: 'app-adverse-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './adverse-event-detail.component.html',
  styleUrls: ['./adverse-event-detail.component.scss']
})
export class AdverseEventDetailComponent implements OnInit {
  private BASE_URL = 'http://localhost:8080/api';

  loading = true;
  error?: string;
  event?: AdverseEvent;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.error = 'Invalid Event ID.'; this.loading = false; return; }

    this.http.get<AdverseEvent>(`${this.BASE_URL}/adverse-events/${id}`).subscribe({
      next: ev => { this.event = ev; this.loading = false; },
      error: () => { this.error = 'Failed to load adverse event.'; this.loading = false; }
    });
  }
}
