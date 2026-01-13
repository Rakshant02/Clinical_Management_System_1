import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdverseEventFormComponent } from './adverse-event-form.component';

describe('AdverseEventFormComponent', () => {
  let component: AdverseEventFormComponent;
  let fixture: ComponentFixture<AdverseEventFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdverseEventFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdverseEventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
