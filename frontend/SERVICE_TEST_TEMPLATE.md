/\*\*

- 🧪 Service Test Template - Minimal
- ES: Template mínimo para tests de servicios
- EN: Minimal service test template
  \*/

import { TestBed } from '@angular/core/testing';
import { BillingService } from './billing';

describe('BillingService', () => {
let service: BillingService;

beforeEach(() => {
TestBed.configureTestingModule({});
service = TestBed.inject(BillingService);
});

it('should be created', () => {
expect(service).toBeTruthy();
});
});
