
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, NonNullableFormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { SiteService } from '../services/site.service';
import { StudySite } from '../models/study-site.model';

@Component({
  selector: 'bt-site-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './site-form.component.html',
  styleUrls: ['./site-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SiteFormComponent {
  form!: FormGroup;

  constructor(private fb: NonNullableFormBuilder, private service: SiteService, private router: Router) {
    this.form = this.fb.group({
      siteId: this.fb.control('', { validators: [Validators.required, Validators.pattern(/^S-\d{3,}$/)] }),
      location: this.fb.control('', { validators: [Validators.required] }),
      investigatorName: this.fb.control('', { validators: [Validators.required] })
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload: StudySite = this.form.getRawValue();
    this.service.create(payload).subscribe(() => {
      // After saving, you will see new site in /protocol/sites and it will be available in /protocol/create
      this.router.navigate(['/protocol/sites'], { replaceUrl: true });
    });
  }
}
