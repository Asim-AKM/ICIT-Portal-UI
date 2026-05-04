import { TestBed } from '@angular/core/testing';

import { DeprtmentService } from './deprtment-service';

describe('DeprtmentService', () => {
  let service: DeprtmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeprtmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
