<<<<<<< HEAD

// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
=======
>>>>>>> ade856f66af0965719114f0e6521c8fe9b1d968c

// src/app/app.component.ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ProtocolDashboardComponent } from './modules/protocol/protocol-dashboard/protocol-dashboard.component';
// If you have a footer component, import it similarly
import { AuditLogTableComponent } from "./modules/compliance/components/audit-log-table/audit-log-table.component";
@Component({
  selector: 'app-root',
  standalone: true,
<<<<<<< HEAD
  imports: [RouterOutlet, NavbarComponent, FooterComponent], // <-- IMPORTANT
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
=======
  imports: [RouterOutlet, NavbarComponent,FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
   title = 'frontend';
}
>>>>>>> ade856f66af0965719114f0e6521c8fe9b1d968c
