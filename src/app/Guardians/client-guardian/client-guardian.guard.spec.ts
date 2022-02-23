import { TestBed } from '@angular/core/testing'

import { ClientGuardianGuard } from './client-guardian.guard'

describe('ClientGuardianGuard', () => {
  let guard: ClientGuardianGuard

  beforeEach(() => {
    TestBed.configureTestingModule({})
    guard = TestBed.inject(ClientGuardianGuard)
  })

  it('should be created', () => {
    expect(guard).toBeTruthy()
  })
})
