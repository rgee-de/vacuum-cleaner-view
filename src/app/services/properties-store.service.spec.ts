import {TestBed} from '@angular/core/testing';

import {PropertiesStoreService} from './properties-store.service';

describe('PropertiesStoreService', () => {
  let service: PropertiesStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertiesStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
