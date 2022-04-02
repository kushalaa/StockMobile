import { TestBed } from '@angular/core/testing';

import { BackendCallService } from './backend-call.service';

describe('BackendCallService', () => {
  let service: BackendCallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendCallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
