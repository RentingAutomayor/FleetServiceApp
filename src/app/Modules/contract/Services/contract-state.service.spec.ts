import { TestBed } from '@angular/core/testing';

import { ContractStateService } from './contract-state.service';

describe('ContractStateService', () => {
  let service: ContractStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContractStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
