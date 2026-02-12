import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, NonNullableFormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ProtocolService } from '../services/protocol.service';
import { TrialProtocol } from '../models/trial-protocol.model';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'bt-protocol-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './protocol-list.component.html',
  styleUrls: ['./protocol-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProtocolListComponent implements OnInit {
  protocols$!: Observable<TrialProtocol[]>;
  display$!: Observable<TrialProtocol[]>;

  filterForm!: FormGroup<{
    searchTerm: FormControl<string>;
    phase: FormControl<string>;
    status: FormControl<string>;
  }>;

  phases = ['I', 'II', 'III'];
  statuses = ['ACTIVE', 'COMPLETED'];

  constructor(
    private protocolService: ProtocolService,
    private fb: NonNullableFormBuilder
  ) {
    this.filterForm = this.fb.group({
      searchTerm: this.fb.control(''),
      phase: this.fb.control(''),
      status: this.fb.control('')
    });
  }

  ngOnInit(): void {
    this.protocols$ = this.protocolService.protocols$;

    this.display$ = combineLatest([
      this.protocols$,
      this.filterForm.valueChanges.pipe(startWith(this.filterForm.getRawValue()))
    ]).pipe(
      map(([protocols, filters]) => {
        const term = (filters.searchTerm || '').toLowerCase().trim();
        const phase = filters.phase || '';
        const status = filters.status || '';

        return protocols.filter(p => {
          const matchesTerm = !term || 
            (p.protocolId?.toLowerCase().includes(term)) || 
            (p.title?.toLowerCase().includes(term));
          const matchesPhase = !phase || p.phase === phase;
          const matchesStatus = !status || p.status === status;
          return matchesTerm && matchesPhase && matchesStatus;
        });
      })
    );
  }

  onDelete(id: string | undefined): void {
    if (!id) return;
    if (confirm(`Are you sure you want to delete Protocol ${id}?`)) {
      this.protocolService.delete(id).subscribe();
    }
  }
}