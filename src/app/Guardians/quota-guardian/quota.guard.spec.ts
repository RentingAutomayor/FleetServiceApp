import { TestBed } from '@angular/core/testing';

import { QuotaGuard } from './quota.guard';

describe('QuotaGuard', () => {
  let guard: QuotaGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(QuotaGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
