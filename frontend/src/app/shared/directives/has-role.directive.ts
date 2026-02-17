import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy } from '@angular/core';
import { AuthService } from '../../Auth/AuthService';
import { Subscription } from 'rxjs';

@Directive({ selector: '[hasRole]' })
export class HasRoleDirective implements OnDestroy {
  private sub: Subscription;
  private roles: string[] = [];

  constructor(
    private tpl: TemplateRef<any>,
    private vc: ViewContainerRef,
    private auth: AuthService
  ) {
    this.sub = this.auth.role$.subscribe(() => this.update());
  }

  @Input()
  set hasRole(val: string | string[]) {
    this.roles = Array.isArray(val) ? val : val.split(',').map(s => s.trim());
    this.update();
  }

  private update() {
    const role = this.auth.getRole();
    const show = !!role && (this.roles.length === 0 || this.roles.includes(role));
    this.vc.clear();
    if (show) this.vc.createEmbeddedView(this.tpl);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}