import { Component, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DeviationService } from '../../services/deviation.service';
import { ProtocolDeviation } from '../../models';

@Component({
  selector: 'app-deviation-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './deviation-list.component.html',
  styleUrls: ['./deviation-list.component.css'],
})
export class DeviationListComponent {
  /** Signals are initialized in the constructor to avoid "used before initialization" error */
  deviationsSig!: Signal<ProtocolDeviation[]>;
  sortedSig!: Signal<ProtocolDeviation[]>;

  constructor(private svc: DeviationService, private router: Router) {
    // Safe: svc is available here
    this.deviationsSig = this.svc.listSig;

    // Newest first: by Reported timestamp if present, else by DeviationID
    this.sortedSig = computed(() => {
      const list = this.deviationsSig() ?? [];
      return [...list].sort((a, b) => {
        const ad = Date.parse(a.ReportedDate ?? '');
        const bd = Date.parse(b.ReportedDate ?? '');
        if (!isNaN(ad) && !isNaN(bd)) return bd - ad;
        return b.DeviationID.localeCompare(a.DeviationID);
      });
    });
  }

  /** Navigate to the New form */
  onNewDeviation(): void {
    this.router.navigate(['/data-capture/deviations/new']);
  }

  /** Keep DOM stable */
  trackById(_: number, item: ProtocolDeviation): string {
    return item.DeviationID;
  }
}
