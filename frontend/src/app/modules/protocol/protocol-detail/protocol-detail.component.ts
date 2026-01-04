
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProtocolService } from '../services/protocol.service';
import { TrialProtocol } from '../models/trial-protocol.model';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'bt-protocol-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './protocol-detail.component.html',
  styleUrls: ['./protocol-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProtocolDetailComponent implements OnInit {
  protocol$!: Observable<TrialProtocol | undefined>;

  constructor(private route: ActivatedRoute, private service: ProtocolService) {}

  ngOnInit(): void {
    this.protocol$ = this.route.paramMap.pipe(
      switchMap(params => this.service.getById(params.get('id')!)
    ));
  }
}
