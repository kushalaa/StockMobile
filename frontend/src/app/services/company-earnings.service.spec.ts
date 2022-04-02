import { TestBed } from '@angular/core/testing';

import { CompanyEarningsService } from './company-earnings.service';

describe('CompanyEarningsService', () => {
  let service: CompanyEarningsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyEarningsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
