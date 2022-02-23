import { TestBed } from '@angular/core/testing'

import { MaintenanceRoutineService } from './maintenance-routine.service'

describe('MaintenanceRoutineService', () => {
  let service: MaintenanceRoutineService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(MaintenanceRoutineService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
