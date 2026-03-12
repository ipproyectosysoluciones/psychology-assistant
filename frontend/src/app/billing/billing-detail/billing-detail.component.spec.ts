import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BillingDetailComponent } from './billing-detail.component';

/**
 * ES: Tests para el BillingDetailComponent
 * EN: Tests for BillingDetailComponent
 */
describe('BillingDetailComponent', () => {
  let component: BillingDetailComponent;
  let fixture: ComponentFixture<BillingDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingDetailComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BillingDetailComponent);
    component = fixture.componentInstance;
  });
});
