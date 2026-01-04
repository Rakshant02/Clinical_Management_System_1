import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { FooterComponent } from "./shared/footer/footer.component";
import { AuditLogTableComponent } from "./modules/compliance/components/audit-log-table/audit-log-table.component";
import { AdminDashboardComponent } from "./modules/analytics/analytics/components/admin-dashboard/admin-dashboard.component";
import { ResearcherDashboardComponent } from "./modules/analytics/analytics/components/researcher-dashboard/researcher-dashboard.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent,],
  standalone:true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
