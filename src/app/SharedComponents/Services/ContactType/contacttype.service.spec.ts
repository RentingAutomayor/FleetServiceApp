import { TestBed } from '@angular/core/testing';

import { ContacttypeService } from './contacttype.service';

describe('ContacttypeService', () => {
  let service: ContacttypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContacttypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
