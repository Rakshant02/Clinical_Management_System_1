
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdverseEventService, AdverseEvent } from '../../services/adverse-event-service';

type Severity = 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL';

@Component({
  selector: 'app-adverse-event-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './adverse-event-list.component.html',
  styleUrls: ['./adverse-event-list.component.css']
})
export class AdverseEventListComponent implements OnInit {
  events: AdverseEvent[] = [];
  loading = true;

  // '' means "All Severities"
  severityFilter: '' | Severity = '';

  constructor(private aeSvc: AdverseEventService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.aeSvc.list().subscribe({
      next: rows => {
        this.events = rows || [];
        this.loading = false;
      },
      error: () => {
        this.events = [];
        this.loading = false;
      }
    });
  }

  // Client-side filter (matches the dropdown)
  get eventsFiltered(): AdverseEvent[] {
    if (!this.severityFilter) return this.events;
    return this.events.filter(e => e.severity === this.severityFilter);
  }
}
