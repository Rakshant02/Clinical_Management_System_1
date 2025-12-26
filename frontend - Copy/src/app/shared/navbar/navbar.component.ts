import { Component } from '@angular/core';
import { AnalyticsRoutingModule } from "../../modules/analytics/analytics-routing.module";

@Component({
  selector: 'app-navbar',
  imports: [AnalyticsRoutingModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
   
}
