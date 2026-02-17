import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './AuthService';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowed = route.data['roles'] as string[] | undefined;
    const role = this.auth.getRole();
    if (!allowed || allowed.length === 0) return true;
    if (role && allowed.includes(role)) return true;
    this.router.navigate(['/']);
    return false;
  }
}