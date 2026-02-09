// // src/app/shared/navbar/navbar.component.ts
// import { NgIf } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import {
//   NavigationEnd,
//   Router,
//   RouterLink,
//   RouterLinkActive,
// } from '@angular/router';
// //import { NgIf } from "../../../../node_modules/@angular/common/common_module.d-NEF7UaHr";

// @Component({
//   selector: 'app-navbar',
//   imports: [RouterLink, RouterLinkActive, NgIf],
//   standalone: true,
//   templateUrl: './navbar.component.html',
//   styleUrls: ['./navbar.component.css'],
// })
// export class NavbarComponent implements OnInit {
//   showNavbar: boolean = true;
//   constructor(private router: Router) {}
//   ngOnInit(): void {
//     this.router.events.subscribe((event) => {
//       if (event instanceof NavigationEnd) {
//         if (event.url === '/login' || event.url === '/register') {
//           this.showNavbar = false;
//         } else {
//           this.showNavbar = true;
//         }
//       }
//     });
//   }
// }
// src/app/shared/navbar/navbar.component.ts
import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, Subject, takeUntil, map } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  showNavbar = true;
  private destroy$ = new Subject<void>();

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    // Set initial state on first render (refresh/deep link)
    this.showNavbar = !this.getDeepestChildData(this.activatedRoute)?.['hideNavbar'];

    // Update on navigation
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd), takeUntil(this.destroy$))
      .subscribe(() => {
        const hide = this.getDeepestChildData(this.activatedRoute)?.['hideNavbar'] === true;
        this.showNavbar = !hide;
      });
  }

  private getDeepestChildData(route: ActivatedRoute): Record<string, any> | undefined {
    let r = route;
    while (r.firstChild) r = r.firstChild;
    return r.snapshot.data;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
