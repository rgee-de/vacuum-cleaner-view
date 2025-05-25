import {computed, inject, Injectable, signal} from '@angular/core';
import {RoomModel} from '../models/room.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomStoreService {

  private readonly http = inject(HttpClient);
  private readonly _rooms = signal<RoomModel[]>([])

  readonly rooms = this._rooms.asReadonly();

  byId = (id: number) =>
    computed(() => this._rooms().find(r => r.id === id));

  load(): void {
    this.http.get<RoomModel[]>(environment.apiEndpoint + 'rooms').subscribe({
      next: data => this._rooms.set(data),
      error: err => console.error('[RoomStore] load failed', err)
    })
  }
}
