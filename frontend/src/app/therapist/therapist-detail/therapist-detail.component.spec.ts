import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TherapistService } from '../../services/therapist';
import { TherapistDetailComponent } from './therapist-detail.component';

/**
 * ES: Tests para el TherapistDetailComponent
 * EN: Tests for TherapistDetailComponent
 */
describe('TherapistDetailComponent', () => {
  let component: TherapistDetailComponent;
  let fixture: ComponentFixture<TherapistDetailComponent>;
  let therapistService: jasmine.SpyObj<TherapistService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('TherapistService', [
      'getTherapist',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteSpy = { snapshot: { paramMap: { get: () => '1' } } };

    await TestBed.configureTestingModule({
      imports: [TherapistDetailComponent, HttpClientTestingModule],
      providers: [
        { provide: TherapistService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    }).compileComponents();

    therapistService = TestBed.inject(
      TherapistService,
    ) as jasmine.SpyObj<TherapistService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(TherapistDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
