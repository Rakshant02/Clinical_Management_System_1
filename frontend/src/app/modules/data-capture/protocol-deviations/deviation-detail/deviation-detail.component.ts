import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviationService } from '../../services/deviation.service';

// Local UI model (camelCase) used by the template
type DeviationStatus = 'OPEN' | 'UNDER_REVIEW' | 'CLOSED';
type DeviationSeverity = 'MINOR' | 'MAJOR' | 'CRITICAL';
interface Deviation {
  id: string;
  status: DeviationStatus;
  severity: DeviationSeverity;
  protocolId: string;
  participantId: string;
  observationId?: string;
  detectedBy?: string | number;
  reportedDate: string | Date;
  capaRef?: string;
  correctiveAction?: string;
  description?: string;
}

@Component({
  selector: 'app-deviation-detail',
  standalone: true,
  templateUrl: './deviation-detail.component.html',
  styleUrls: ['./deviation-detail.component.css'],
  imports: [CommonModule],
})
export class DeviationDetailComponent {
  private deviationSubject = new BehaviorSubject<Deviation | null>(null);
  deviation$ = this.deviationSubject.asObservable();

  lastUpdated = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private svc: DeviationService
  ) {
    this.route.paramMap.subscribe((pm) => {
      const id = pm.get('id');
      if (!id) {
        this.setDeviation(null);
        return;
      }

      const pd = this.svc.get(id);
      if (!pd) {
        this.setDeviation(null);
        return;
      }

      // Map from ProtocolDeviation (PascalCase) to local Deviation (camelCase)
      const mapped: Deviation = {
        id: pd.DeviationID,
        status: pd.Status as DeviationStatus,
        severity: pd.Severity as DeviationSeverity,
        protocolId: pd.ProtocolID ?? '—',
        participantId: pd.ParticipantID ?? '—',
        observationId: pd.ObservationID,
        detectedBy: pd.DetectedBy,
        reportedDate: pd.ReportedDate ?? new Date().toISOString(),
        // Safely extract optional fields even if your interface doesn't declare them
        // capaRef: safeExtract(pd, ['CAPARef', 'CapaRef', 'CAPA', 'capaRef']),
        // correctiveAction: safeExtract(pd, ['CorrectiveAction', 'Corrective_Action', 'correctiveAction']),
        description: pd.Description,
      };

      this.setDeviation(mapped);
    });
  }

  setDeviation(updated: Deviation | null) {
    this.deviationSubject.next(updated ? { ...updated } : null);
    this.lastUpdated = new Date();
  }

  onBack() {
    this.router.navigate(['/data-capture/deviations']);
  }

  onMarkUnderReview() {
    const current = this.deviationSubject.getValue();
    if (!current) return;

    const updatedPd = this.svc.updateStatus(current.id, 'UNDER_REVIEW');

    if (updatedPd) {
      const mapped: Deviation = {
        id: updatedPd.DeviationID,
        status: updatedPd.Status as DeviationStatus,
        severity: updatedPd.Severity as DeviationSeverity,
        protocolId: updatedPd.ProtocolID ?? current.protocolId,
        participantId: updatedPd.ParticipantID ?? current.participantId,
        observationId: updatedPd.ObservationID ?? current.observationId,
        detectedBy: updatedPd.DetectedBy ?? current.detectedBy,
        reportedDate: updatedPd.ReportedDate ?? current.reportedDate,
        capaRef: safeExtract(updatedPd as any, ['CAPARef', 'CapaRef', 'CAPA', 'capaRef']) ?? current.capaRef,
        correctiveAction:
          safeExtract(updatedPd as any, ['CorrectiveAction', 'Corrective_Action', 'correctiveAction']) ??
          current.correctiveAction,
        description: updatedPd.Description ?? current.description,
      };
      this.setDeviation(mapped);
    } else {
      // Fallback local update
      this.setDeviation({ ...current, status: 'UNDER_REVIEW' });
    }
  }
}

/** Safely get a field by trying multiple likely keys. */
function safeExtract<T extends object>(obj: T | null | undefined, keys: string[]): any {
  if (!obj) return undefined;
  for (const k of keys) {
    if (k in obj) {
      const v = (obj as any)[k];
      if (v !== undefined && v !== null && v !== '') return v;
    }
  }
  return undefined;
}