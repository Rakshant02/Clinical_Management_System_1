
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'bt-protocol-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './protocol-dashboard.component.html',
  styleUrls: ['./protocol-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProtocolDashboardComponent {}

