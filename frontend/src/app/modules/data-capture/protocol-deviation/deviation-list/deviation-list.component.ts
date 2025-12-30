
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DeviationService } from '../../services/deviation.service';
import { ProtocolDeviation } from '../../models/protocol-deviation';

@Component({
  selector: 'biotrack-deviation-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deviation-list.component.html',
  styleUrls: ['./deviation-list.component.css']
})
export class DeviationListComponent implements OnInit {
  deviations: ProtocolDeviation[] = [];
  loading = false;

  constructor(private svc: DeviationService, private router: Router) {}

  ngOnInit(): void {
    this.loading = true;
    this.svc.list().subscribe({
      next: (res) => { this.deviations = res; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  newDeviation() {
    this.router.navigate(['/data-capture/deviations/new']);
  }

  openDetail(id?: string) {
    if (!id) return;
    this.router.navigate(['/data-capture/deviations', id]);
  }
}
