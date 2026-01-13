import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviationDetailComponent } from './deviation-detail.component';

describe('DeviationDetailComponent', () => {
  let component: DeviationDetailComponent;
  let fixture: ComponentFixture<DeviationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviationDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
