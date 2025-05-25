import {computed, inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RoomModel} from '../models/room.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertiesStoreService {
  private readonly http = inject(HttpClient);
  private readonly _properties = signal<RoomModel[]>([])

  readonly properties = this._properties.asReadonly();

  byId = (id: number) =>
    computed(() => this._properties().find(r => r.id === id));

  load(): void {
    this.http.get<RoomModel[]>(environment.apiEndpoint + 'prop').subscribe({
      next: data => this._properties.set(data),
      error: err => console.error('[PropertiesStore] load failed', err)
    })
  }
}
