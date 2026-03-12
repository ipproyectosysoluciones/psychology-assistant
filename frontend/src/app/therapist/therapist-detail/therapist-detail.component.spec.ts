import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TherapistDetailComponent } from './therapist-detail.component';

/**
 * ES: Tests para el TherapistDetailComponent
 * EN: Tests for TherapistDetailComponent
 */
describe('TherapistDetailComponent', () => {
  let component: TherapistDetailComponent;
  let fixture: ComponentFixture<TherapistDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TherapistDetailComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TherapistDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
