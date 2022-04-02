import { TestBed } from '@angular/core/testing';

import { CompanyQuoteService } from './company-quote.service';

describe('CompanyQuoteService', () => {
  let service: CompanyQuoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyQuoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
