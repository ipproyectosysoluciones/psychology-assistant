import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClinicDetailComponent } from './clinic-detail.component';

/**
 * ES: Tests para el ClinicDetailComponent
 * EN: Tests for ClinicDetailComponent
 */
describe('ClinicDetailComponent', () => {
  let component: ClinicDetailComponent;
  let fixture: ComponentFixture<ClinicDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicDetailComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ClinicDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
