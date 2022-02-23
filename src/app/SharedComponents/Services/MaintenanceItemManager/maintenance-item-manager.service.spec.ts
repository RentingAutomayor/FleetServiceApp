import { TestBed } from '@angular/core/testing'

import { MaintenanceItemManagerService } from './maintenance-item-manager.service'

describe('MaintenanceItemManagerService', () => {
  let service: MaintenanceItemManagerService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(MaintenanceItemManagerService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
