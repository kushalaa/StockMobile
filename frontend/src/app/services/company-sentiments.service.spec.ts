import { TestBed } from '@angular/core/testing';

import { CompanySentimentsService } from './company-sentiments.service';

describe('CompanySentimentsService', () => {
  let service: CompanySentimentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanySentimentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
