
import { Pipe, PipeTransform } from '@angular/core';

/** Custom Pipe: "today", "yesterday", "N days ago" */
@Pipe({ name: 'dateSpan', standalone: true })
export class DateSpanPipe implements PipeTransform {
  transform(value?: string | Date): string {
    if (!value) return '-';
    const d = typeof value === 'string' ? new Date(value) : value;
    const now = new Date();
    const ms = now.getTime() - d.getTime();
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    if (days <= 0) return 'today';
    if (days === 1) return 'yesterday';
    return `${days} days ago`;
  }
}
