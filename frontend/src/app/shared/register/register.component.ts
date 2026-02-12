import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  username = '';
  password = '';
  confirmPassword = '';
  role = '';

  constructor(private router: Router) {}

  onRegister() {
    // 1. Check if all fields are filled
    if (!this.username || !this.password || !this.confirmPassword || !this.role) {
      alert('Please fill all fields!');
      return;
    }

    // 2. Validate Password Match
    if (this.password !== this.confirmPassword) {
      console.error('%c Registration Error: Passwords do not match ', "background: #fee2e2; color: #ef4444; border: 1px solid #ef4444;");
      alert('Passwords do not match!');
      return;
    }

    // 3. Log Full Information for Backend Account Creation
    const newUserPayload = {
      event: 'USER_REGISTRATION',
      data: {
        username: this.username,
        password: this.password, // In development, useful to see if binding works
        role: this.role
      },
      audit: {
        userAgent: navigator.userAgent,
        createdDate: new Date().toLocaleString()
      }
    };

    console.log("%c BioTrack | New Registration ", "color: white; background: #0f172a; font-weight: bold; border-radius: 3px; padding: 2px 5px;");
    console.log("Backend Payload:", newUserPayload);

    // 4. Success feedback and redirect
    alert(`Registration successful! Welcome, ${this.username}.`);
    this.router.navigate(['/login']);
  }
}