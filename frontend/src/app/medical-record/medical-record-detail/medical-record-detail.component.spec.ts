import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicalRecordDetailComponent } from './medical-record-detail.component';

/**
 * ES: Tests para el MedicalRecordDetailComponent
 * EN: Tests for MedicalRecordDetailComponent
 */
describe('MedicalRecordDetailComponent', () => {
  let component: MedicalRecordDetailComponent;
  let fixture: ComponentFixture<MedicalRecordDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalRecordDetailComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalRecordDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
