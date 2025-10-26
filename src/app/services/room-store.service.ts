import {effect, inject, Injectable, signal} from '@angular/core';
import {RoomModel} from '../models/room.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

const STORAGE_KEY = 'rooms';

@Injectable({
  providedIn: 'root'
})
export class RoomStoreService {

  private readonly http = inject(HttpClient);
  private readonly _rooms = signal<RoomModel[]>(this._loadFromStorage())

  readonly rooms = this._rooms.asReadonly();

  constructor() {
    effect(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this._rooms()));
      } catch (e) {
        console.warn('[RoomStore] Failed to write localStorage', e);
      }
    });
  }

  load(): void {
    this.http.get<RoomModel[]>(environment.apiEndpoint + 'rooms').subscribe({
      next: data => this._rooms.set(data),
      error: err => {
        console.error('[RoomStore] load failed', err)
        this._rooms.set([]);
      }
    })
  }

  private _loadFromStorage(): RoomModel[] {
    try {
      const json = localStorage.getItem(STORAGE_KEY);
      return json ? JSON.parse(json) : [];
    } catch (e) {
      console.warn('[RoomStore] Failed to parse localStorage', e);
      return [];
    }
  }
}
