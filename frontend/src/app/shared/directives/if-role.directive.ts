import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

/** Custom Structural Directive: *appIfRole="'investigator'" */
@Directive({ selector: '[appIfRole]', standalone: true })
export class IfRoleDirective {
  private hasView = false;
  private _role?: string;

  @Input('appIfRole') set role(value: string | undefined) {
    this._role = value?.toLowerCase();
    this.update();
  }

  constructor(private tpl: TemplateRef<any>, private vcr: ViewContainerRef) {}

  private currentUserRole(): string {
    return (localStorage.getItem('currentUserRole') || 'investigator').toLowerCase();
  }

  private update(): void {
    const show = this.currentUserRole() === (this._role || '');
    if (show && !this.hasView) {
      this.vcr.createEmbeddedView(this.tpl);
      this.hasView = true;
    } else if (!show && this.hasView) {
      this.vcr.clear();
      this.hasView = false;
    }
  }
}
