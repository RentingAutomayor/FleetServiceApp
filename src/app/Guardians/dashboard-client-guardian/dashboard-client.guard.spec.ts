import { TestBed } from '@angular/core/testing';

import { DashboardClientGuard } from './dashboard-client.guard';

describe('DashboardClientGuard', () => {
  let guard: DashboardClientGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DashboardClientGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
