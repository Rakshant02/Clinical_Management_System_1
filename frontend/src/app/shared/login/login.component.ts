import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username = '';
  password = '';
  role = '';

  constructor(private router: Router) {}

  onLogin() {
    if (this.username && this.password && this.role) {
      // 1. Log JSON Payload for Backend Authorization Audit
      const authRequest = {
        type: 'AUTHORIZATION_REQUEST',
        payload: {
          username: this.username,
          password: '********', // Password masked in logs for security
          role: this.role
        },
        timestamp: new Date().toISOString()
      };

      console.log("%c BioTrack | Login Attempt ", "color: white; background: #2563eb; font-weight: bold; border-radius: 3px; padding: 2px 5px;");
      console.table(authRequest.payload);

      // 2. Role-Based Navigation Logic
      if (this.role === 'admin') {
        console.log(`%c Redirecting to: Admin Dashboard`, "color: #2563eb; font-style: italic;");
        this.router.navigate(['/admin-dashboard']);
      } else if (this.role === 'investigator') {
        console.log(`%c Redirecting to: Investigator Dashboard`, "color: #2563eb; font-style: italic;");
        this.router.navigate(['/investigator-dashboard']);
      } else {
        console.log(`%c Redirecting to: User Dashboard`, "color: #2563eb; font-style: italic;");
        this.router.navigate(['/user-dashboard']);
      }
    } else {
      alert('Please fill all fields!');
    }
  }
}