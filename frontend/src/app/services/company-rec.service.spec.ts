import { TestBed } from '@angular/core/testing';

import { CompanyRecService } from './company-rec.service';

describe('CompanyRecService', () => {
  let service: CompanyRecService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyRecService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
