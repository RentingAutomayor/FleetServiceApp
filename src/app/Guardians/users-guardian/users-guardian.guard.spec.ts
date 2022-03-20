import { TestBed } from '@angular/core/testing'

import { UsersGuardianGuard } from './users-guardian.guard'

describe('UsersGuardianGuard', () => {
  let guard: UsersGuardianGuard

  beforeEach(() => {
    TestBed.configureTestingModule({})
    guard = TestBed.inject(UsersGuardianGuard)
  })

  it('should be created', () => {
    expect(guard).toBeTruthy()
  })
})
