
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../services/analytics.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-researcher-dashboard',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './researcher-dashboard.component.html',
  styleUrls: ['./researcher-dashboard.component.css']
})
export class ResearcherDashboardComponent implements OnInit {

  protocols: any[] = [];
  participants: any[] = [];
  trialReports: any[] = [];

  selectedProtocolId: string | null = null;
  selectedProtocol: any | null = null;
  selectedTrialReport: any | null = null;

  filteredParticipants: any[] = [];

  constructor(private analytics: AnalyticsService) {}

  ngOnInit(): void {
   
    this.protocols = this.analytics.getProtocols();
    this.participants = this.analytics.getParticipants();
    this.trialReports = this.analytics.getTrialReports();

    
    this.selectedProtocolId = this.protocols?.[0]?.protocolId ?? null;
    this.updateSelection();
  }

  onProtocolChange(protocolId: string): void {
    this.selectedProtocolId = protocolId;
    this.updateSelection();
  }

  private updateSelection(): void {
    if (!this.selectedProtocolId) {
      this.selectedProtocol = null;
      this.filteredParticipants = [];
      this.selectedTrialReport = null;
      return;
    }

    this.selectedProtocol = this.protocols.find(p => p.protocolId === this.selectedProtocolId) ?? null;
    this.filteredParticipants = this.participants.filter(p => p.protocolId === this.selectedProtocolId);
    this.selectedTrialReport = this.trialReports.find(r => r.protocolId === this.selectedProtocolId) ?? null;
  }

 
  get totalParticipants(): number {
    return this.filteredParticipants.length;
  }

  get enrolledCount(): number {
    return this.filteredParticipants.filter(p => p.status === 'enrolled').length;
  }

  get completedCount(): number {
    return this.filteredParticipants.filter(p => p.status === 'completed').length;
  }

  get withdrawnCount(): number {
    return this.filteredParticipants.filter(p => p.status === 'withdrawn').length;
  }
}
