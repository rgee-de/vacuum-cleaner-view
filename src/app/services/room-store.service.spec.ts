import { TestBed } from '@angular/core/testing';

import { RoomStoreService } from './room-store.service';

describe('RoomStoreService', () => {
  let service: RoomStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
