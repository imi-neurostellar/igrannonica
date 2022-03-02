import { TestBed } from '@angular/core/testing';

import { LibraryServiceService } from './library.service';

describe('LibraryService', () => {
  let service: LibraryServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibraryServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
