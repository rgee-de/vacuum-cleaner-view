import {computed, inject, Injectable, signal} from '@angular/core';
import {RoomStoreService} from './room-store.service';
import {RoomModel} from '../models/room.model';

@Injectable({
  providedIn: 'root'
})
export class SelectedRoomStoreService {
  private readonly roomStore = inject(RoomStoreService);

  private readonly _selectedIds = signal<Set<number>>(new Set())

  readonly selectedIds = computed<number[]>(() => Array.from(this._selectedIds()).sort((a,b) => a - b));

  readonly selectedRooms = computed<RoomModel[]>(() => {
    const selected = this._selectedIds();
    const rooms = this.roomStore.rooms();
    return rooms.filter(r => selected.has(r.id));
  });

  readonly count = computed(() => this._selectedIds().size);
  readonly hasSelection = computed(() => this._selectedIds().size > 0);

  private readonly

  effect(() => {

});

}
