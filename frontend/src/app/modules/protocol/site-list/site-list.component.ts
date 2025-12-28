
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SiteService } from '../services/site.service';
import { StudySite } from '../models/study-site.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'bt-site-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SiteListComponent implements OnInit {
  sites$!: Observable<StudySite[]>;
  constructor(private siteService: SiteService) {}

  ngOnInit(): void {
    this.sites$ = this.siteService.loadAll();
  }
}
