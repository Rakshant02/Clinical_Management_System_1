import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule , FormsModule , RouterLink],
  standalone:true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  role: string = '';
  constructor(private router: Router) {}

  onLogin() {
    if (this.username && this.password && this.role) {
      if (this.role === 'admin') {
        this.router.navigate(['/admin-dashboard']);
      } else if (this.role === 'investigator') {
        this.router.navigate(['/investigator-dashboard']);
      } else {
        this.router.navigate(['/user-dashboard']);
      }
    } else {
      alert('Please fill all fields!');
    }
  }
}
