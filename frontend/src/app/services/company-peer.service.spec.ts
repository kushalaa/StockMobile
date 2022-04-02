import { TestBed } from '@angular/core/testing';

import { CompanyPeerService } from './company-peer.service';

describe('CompanyPeerService', () => {
  let service: CompanyPeerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyPeerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
