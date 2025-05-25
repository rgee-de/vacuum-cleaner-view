import {TestBed} from '@angular/core/testing';

import {CleaningModesStoreService} from './cleaning-modes-store.service';

describe('CleaningModesStoreService', () => {
  let service: CleaningModesStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CleaningModesStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
