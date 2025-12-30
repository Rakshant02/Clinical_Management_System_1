
// src/app/shared/navbar/navbar.component.ts
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
<<<<<<< HEAD
  standalone: true,
  imports: [RouterLink, RouterLinkActive], // if template uses routerLink
=======
  imports: [RouterLink, RouterLinkActive],
  standalone:true,
>>>>>>> ade856f66af0965719114f0e6521c8fe9b1d968c
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
<<<<<<< HEAD
export class NavbarComponent {}
=======
export class NavbarComponent {
   
}
>>>>>>> ade856f66af0965719114f0e6521c8fe9b1d968c
