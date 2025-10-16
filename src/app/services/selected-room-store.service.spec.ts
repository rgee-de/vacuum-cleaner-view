import { TestBed } from '@angular/core/testing';

import { SelectedRoomStoreService } from './selected-room-store.service';

describe('SelectedRoomStoreService', () => {
  let service: SelectedRoomStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedRoomStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
