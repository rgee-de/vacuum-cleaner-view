import {TestBed} from '@angular/core/testing';

import {RepeatStoreService} from './repeat-store.service';

describe('RepeatStoreService', () => {
  let service: RepeatStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RepeatStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
