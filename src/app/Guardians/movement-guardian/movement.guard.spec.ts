import { TestBed } from '@angular/core/testing';

import { MovementGuard } from './movement.guard';

describe('MovementGuard', () => {
  let guard: MovementGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MovementGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
