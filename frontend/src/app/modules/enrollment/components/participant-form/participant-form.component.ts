import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Participant } from '../../models/participant.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TrialProtocol } from '../../../protocol/models/trial-protocol.model'; 
import { ProtocolService } from '../../../protocol/services/protocol.service';

@Component({
  selector: 'bt-participant-form',
  templateUrl: './participant-form.component.html',
  styleUrls: ['./participant-form.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ParticipantFormComponent {
  
  @Input() participant: Participant = {
    participantId: '',
    name: '',
    dob: '',
    contactInfo: '',
    gender: '',
    address: '',
    bp: '',
    heartRate: null,
    temperature: null,
    respiratoryRate: null,
    hemoglobin: null,
    diabetes: null,
    eligibilityStatus: 'PENDING',
    enrollmentStatus: 'PENDING'
  };

  @Input() existingParticipants: Participant[] = []; // 👈 pass existing participants list

  @Output() saveParticipant = new EventEmitter<Participant>();

  protocols: TrialProtocol[] = []; 
  constructor(private protocolService: ProtocolService) 
  {} 
  ngOnInit(): void 
  {
     this.protocolService.loadAll().subscribe(data =>
       { this.protocols = data; 

       });
      // Auto-generate participant ID 
      this.participant.participantId = this.generateParticipantId(this.existingParticipants);

  }

  // ✅ Eligibility validation: must be 18+
  private validateEligibility(participant: Participant): boolean {
    if (!participant.dob) return false;
    const dob = new Date(participant.dob);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age >= 18;
  }

  // ✅ Protocol criteria validation 
  private validateProtocolCriteria(participant: Participant, protocol: TrialProtocol): boolean 
  {
     const dob = new Date(participant.dob); 
     const today = new Date();
     let age = today.getFullYear() - dob.getFullYear();
     const m = today.getMonth() - dob.getMonth();
     if (m < 0 || (m === 0 && today.getDate() < dob.getDate()))
       { age--; } 
    //  const criteria = protocol.inclusionCriteria;
    //  if (!criteria) return true; 
    //  if (criteria.minAge && age < criteria.minAge) 
    //   return false; 
    // if (criteria.maxAge && age > criteria.maxAge)
    //    return false; 
    // if (criteria.minHemoglobin && participant.hemoglobin < criteria.minHemoglobin) 
    //   return false; 
    // if (criteria.maxHemoglobin && participant.hemoglobin > criteria.maxHemoglobin) 
    //   return false; 
    // if (criteria.minHeartRate && participant.heartRate < criteria.minHeartRate) 
    //   return false; 
    // if (criteria.maxHeartRate && participant.heartRate > criteria.maxHeartRate) 
    //   return false; 
    // if (criteria.minTemperature && participant.temperature < criteria.minTemperature) 
    //   return false; 
    // if (criteria.maxTemperature && participant.temperature > criteria.maxTemperature) 
    //   return false; 
    // if (criteria.minRespiratoryRate && participant.respiratoryRate < criteria.minRespiratoryRate) 
    //   return false;
    // if (criteria.maxRespiratoryRate && participant.respiratoryRate > criteria.maxRespiratoryRate) 
    //   return false; 
    // if (criteria.allowedGenders && !criteria.allowedGenders.includes(participant.gender)) 
    //   return false; 
    return true; 
  }

  
  // ✅ Sequential ID generation
  private generateParticipantId(existingParticipants: Participant[]): string {
    if (!existingParticipants || existingParticipants.length === 0) {
      return 'P001';
    }

    const ids = existingParticipants
      .map(p => parseInt(p.participantId.replace('p', ''), 10))
      .filter(num => !isNaN(num));

    const maxId = Math.max(...ids);
    const nextId = maxId + 1;

    return 'P' + nextId.toString().padStart(3, '0');
  }

  onSubmit(): void {
    // Required field check
    if (
      !this.participant.name ||
      !this.participant.dob ||
      !this.participant.contactInfo ||
      !this.participant.gender ||
      !this.participant.address ||
      !this.participant.protocolId ||
      !this.participant.bp ||
      !this.participant.heartRate ||
      !this.participant.temperature ||
      !this.participant.respiratoryRate ||
      !this.participant.hemoglobin ||
      !this.participant.diabetes
    ) {
      alert('Please fill in all required fields before saving.');
      return;
    }

    // General eligibility check
    if (!this.validateEligibility(this.participant)) {
      alert('Participant not eligible (must be 18+).');
      this.participant.eligibilityStatus = 'INELIGIBLE';
      return;
    }


    // ✅ Assign sequential ID before saving 
    this.participant.participantId = this.generateParticipantId(this.existingParticipants);

    // If all checks pass
    this.participant.eligibilityStatus = 'ELIGIBLE';
    this.saveParticipant.emit(this.participant);
  }
}