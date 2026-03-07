import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentDetailComponent } from './appointment-detail';

describe('AppointmentDetailComponent', () => {
  let component: AppointmentDetailComponent;
  let fixture: ComponentFixture<AppointmentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
