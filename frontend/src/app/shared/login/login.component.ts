// src/app/shared/login/login.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../Auth/AuthService';
import { LoginRequest } from '../../../../Models/login-request';
import { environment } from '../../../Environment';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports:[CommonModule,FormsModule]
})
export class LoginComponent {
  model: LoginRequest = { userNameOrEmail: '', password: '', role: 'Researcher' };
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = '';
    this.auth.login(environment.apiUrl, this.model).subscribe({
      next: () => {
        const r = this.auth.getRole();
        if (r === 'Admin') this.router.navigate(['/analytics/admin']);
        else if (r === 'Researcher') this.router.navigate(['/analytics/researcher']);
        else this.router.navigate(['/']); // fallback
      },
      error: err => {
        this.error =
          (typeof err?.error === 'string' ? err.error : err?.error?.message) ||
          err?.message ||
          'Login failed';
      }
    });
  }
}