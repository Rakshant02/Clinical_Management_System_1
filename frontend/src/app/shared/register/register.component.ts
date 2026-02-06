import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule , RouterLink ],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  role: string = '';
  constructor(private router: Router) {}

  onRegister() {
    if (
      !this.username ||
      !this.password ||
      !this.confirmPassword ||
      !this.role
    ) {
      alert('Please fill all fields!');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Registered:', { username: this.username, role: this.role });
    this.router.navigate(['/login']);
  }
}
