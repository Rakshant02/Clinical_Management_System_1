import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Severity } from '../models';


@Component({
  selector: 'app-severity-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <label>Severity:
      <select [ngModel]="selected" (ngModelChange)="selectedChange.emit($event)">
        <option value="">All</option>
        <option value="MILD">Mild</option>
        <option value="MODERATE">Moderate</option>
        <option value="SEVERE">Severe</option>
        <option value="CRITICAL">Critical</option>
      </select>
    </label>
  `
})
export class SeverityFilterComponent {
  @Input() selected: '' | Severity = '';
  @Output() selectedChange = new EventEmitter<'' | Severity>();
}
