
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataCaptureService, Observation } from '../../services/data-capture.service';

@Component({
  selector: 'app-observation-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './observation-list.component.html',
  styleUrls: ['./observation-list.component.css'],
})
export class ObservationListComponent implements OnInit, OnDestroy {
  observations: Observation[] = [];
  loading = false;
  error = '';

  /** Bound via [(ngModel)] in the template */
  participantId?: number;

  /** Subscriptions */
  private initSub?: Subscription;
  private loadSub?: Subscription;

  constructor(private data: DataCaptureService) {}

  ngOnInit(): void {
    this.loading = true;
    this.error = '';

    // Service requires 1 arg → pass undefined to mean "no filter"
    this.initSub = this.data.listObservations(undefined).subscribe({
      next: (list) => {
        this.observations = list ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message ?? 'Failed to load observations';
        this.loading = false;
      },
    });
  }

  /**
   * Reload observations, optionally filtered by participantId.
   * Service requires one argument, so we always pass either a number or undefined.
   */
  load(): void {
    // Cancel any previous load to avoid races
    this.loadSub?.unsubscribe();

    this.loading = true;
    this.error = '';

    const pid: number | undefined =
      this.participantId && this.participantId > 0 ? this.participantId : undefined;

    this.loadSub = this.data.listObservations(pid).subscribe({
      next: (list) => {
        this.observations = list ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message ?? 'Failed to load observations';
        this.loading = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.initSub?.unsubscribe();
    this.loadSub?.unsubscribe();
  }
}
