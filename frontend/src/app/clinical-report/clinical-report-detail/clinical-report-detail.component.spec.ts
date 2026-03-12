import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClinicalReportDetailComponent } from './clinical-report-detail.component';

/**
 * ES: Tests para el ClinicalReportDetailComponent
 * EN: Tests for ClinicalReportDetailComponent
 */
describe('ClinicalReportDetailComponent', () => {
  let component: ClinicalReportDetailComponent;
  let fixture: ComponentFixture<ClinicalReportDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicalReportDetailComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ClinicalReportDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
