
import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

/** Custom Attribute Directive: [appSeverityBadge]="severity" */
@Directive({ selector: '[appSeverityBadge]', standalone: true })
export class SeverityBadgeDirective implements OnChanges {
  @Input('appSeverityBadge') severity?: 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL';

  constructor(private el: ElementRef, private rd: Renderer2) {}

  ngOnChanges(): void {
    const host = this.el.nativeElement as HTMLElement;
    ['mild','moderate','severe','critical'].forEach(c => this.rd.removeClass(host, `badge-${c}`));
    switch (this.severity) {
      case 'MILD': this.rd.addClass(host, 'badge-mild'); break;
      case 'MODERATE': this.rd.addClass(host, 'badge-moderate'); break;
      case 'SEVERE': this.rd.addClass(host, 'badge-severe'); break;
      case 'CRITICAL': this.rd.addClass(host, 'badge-critical'); break;
    }
  }
}


