import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdverseEventDetailComponent } from './adverse-event-detail.component';

describe('AdverseEventDetailComponent', () => {
  let component: AdverseEventDetailComponent;
  let fixture: ComponentFixture<AdverseEventDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdverseEventDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdverseEventDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
