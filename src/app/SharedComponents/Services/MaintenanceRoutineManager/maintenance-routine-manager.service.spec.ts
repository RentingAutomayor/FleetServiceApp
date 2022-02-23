import { TestBed } from '@angular/core/testing';

import { MaintenanceRoutineManagerService } from './maintenance-routine-manager.service';

describe('MaintenanceRoutineManagerService', () => {
  let service: MaintenanceRoutineManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaintenanceRoutineManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
