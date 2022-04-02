import { TestBed } from '@angular/core/testing';

import { CompanyChartService } from './company-chart.service';

describe('CompanyChartService', () => {
  let service: CompanyChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
