import { TestBed } from '@angular/core/testing'

import { WorkorderGuard } from './workorder.guard'

describe('WorkorderGuard', () => {
  let guard: WorkorderGuard

  beforeEach(() => {
    TestBed.configureTestingModule({})
    guard = TestBed.inject(WorkorderGuard)
  })

  it('should be created', () => {
    expect(guard).toBeTruthy()
  })
})
