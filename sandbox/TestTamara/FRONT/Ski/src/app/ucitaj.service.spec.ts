import { TestBed } from '@angular/core/testing';

import { UcitajService } from './ucitaj.service';

describe('UcitajService', () => {
  let service: UcitajService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UcitajService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
