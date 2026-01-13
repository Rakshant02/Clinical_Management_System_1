import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviationFormComponent } from './deviation-form.component';

describe('DeviationFormComponent', () => {
  let component: DeviationFormComponent;
  let fixture: ComponentFixture<DeviationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
