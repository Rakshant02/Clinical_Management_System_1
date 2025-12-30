
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormArray,
  Validators,
  NonNullableFormBuilder,
  FormGroup
} from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProtocolService } from '../services/protocol.service';
import { TrialPhase, TrialStatus, TrialProtocol } from '../models/trial-protocol.model';
import { SiteService } from '../services/site.service';
import { StudySite } from '../models/study-site.model';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'bt-protocol-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './protocol-form.component.html',
  styleUrls: ['./protocol-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProtocolFormComponent implements OnInit {
  phases = Object.values(TrialPhase);
  statuses = Object.values(TrialStatus);

  sites: StudySite[] = [];
  form!: FormGroup;

  isEdit = false;
  private currentId?: string;

  constructor(
    private fb: NonNullableFormBuilder,
    private protocolService: ProtocolService,
    private siteService: SiteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      protocolId: this.fb.control('', { validators: [Validators.required, Validators.pattern(/^P-\d{4,}$/)] }),
      title: this.fb.control('', { validators: [Validators.required, Validators.maxLength(200)] }),
      phase: this.fb.control(TrialPhase.I, { validators: [Validators.required] }),
      startDate: this.fb.control('', { validators: [Validators.required] }),
      endDate: this.fb.control(''),
      status: this.fb.control(TrialStatus.ACTIVE, { validators: [Validators.required] }),
      objectives: this.fb.control(''),
      inclusionCriteria: this.fb.control(''),
      exclusionCriteria: this.fb.control(''),
      version: this.fb.control(1),
      investigators: this.fb.array([]),
      studySiteIds: this.fb.array<string>([])
    });

    // ensure there's at least one investigator row on create
    this.addInvestigator();
  }

  ngOnInit(): void {
    // Always load latest sites (includes newly created ones)
    this.siteService.loadAll().subscribe(list => (this.sites = list));

    // detect edit route and pre-fill
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        const isEditUrl = this.router.url.endsWith('/edit');
        if (!id || !isEditUrl) {
          this.isEdit = false;
          this.currentId = undefined;
          return of(undefined);
        }
        this.isEdit = true;
        this.currentId = id;
        return this.protocolService.getById(id);
      })
    ).subscribe(p => {
      if (p) this.patchProtocol(p);
    });
  }

  // ---------- Form helpers ----------
  get investigators(): FormArray {
    return this.form.get('investigators') as FormArray;
  }
  get studySiteIds(): FormArray {
    return this.form.get('studySiteIds') as FormArray;
  }

  addInvestigator(): void {
    this.investigators.push(this.fb.group({
      name: this.fb.control('', { validators: [Validators.required] }),
      email: this.fb.control(''),
      siteId: this.fb.control<string | null>(null)
    }));
  }
  removeInvestigator(i: number): void {
    this.investigators.removeAt(i);
  }

  toggleSite(siteId: string, checked: boolean): void {
    if (checked) {
      const exists = this.studySiteIds.controls.some(c => c.value === siteId);
      if (!exists) this.studySiteIds.push(this.fb.control(siteId));
    } else {
      const idx = this.studySiteIds.controls.findIndex(c => c.value === siteId);
      if (idx > -1) this.studySiteIds.removeAt(idx);
    }
  }

  private patchProtocol(p: TrialProtocol): void {
    this.form.patchValue({
      protocolId: p.protocolId,
      title: p.title,
      phase: p.phase,
      startDate: p.startDate,
      endDate: p.endDate ?? '',
      status: p.status,
      objectives: p.objectives ?? '',
      inclusionCriteria: p.inclusionCriteria ?? '',
      exclusionCriteria: p.exclusionCriteria ?? '',
      version: p.version ?? 1
    });

    this.investigators.clear();
    (p.investigators ?? []).forEach(inv => {
      this.investigators.push(this.fb.group({
        name: this.fb.control(inv.name, { validators: [Validators.required] }),
        email: this.fb.control(inv.email ?? ''),
        siteId: this.fb.control(inv.siteId ?? null)
      }));
    });

    this.studySiteIds.clear();
    (p.studySiteIds ?? []).forEach(id => this.studySiteIds.push(this.fb.control(id)));
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file && this.currentId) {
      this.protocolService.uploadDocument(this.currentId, file).subscribe();
    }
  }

  // ---------- SAVE (Create / Edit) ----------
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: TrialProtocol = {
      ...(this.form.getRawValue() as TrialProtocol),
      investigators: this.investigators.getRawValue(),
      studySiteIds: this.studySiteIds.getRawValue()
    };

    if (this.isEdit && this.currentId) {
      this.protocolService.update(this.currentId, payload).subscribe(() => {
        this.router.navigate(['/protocol/list']);
      });
    } else {
      this.protocolService.create(payload).subscribe(() => {
        this.router.navigate(['/protocol/list']);
      });
    }
  }
}
