import {inject, Injectable, signal} from '@angular/core';
import {CleaningModesModel, defaultCleaningModes} from '../models/cleaning-modes.model';
import {HttpClient} from '@angular/common/http';
import {RoomModel} from '../models/room.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CleaningModesStoreService {
  private readonly http = inject(HttpClient);
  private readonly _modes = signal<CleaningModesModel>(defaultCleaningModes)

  readonly modes = this._modes.asReadonly();

  load(): void {
    this.http.get<CleaningModesModel>(environment.apiEndpoint + 'modes').subscribe({
      next: data => this._modes.set(data),
      error: err => console.error('[CleaningModesStore] load failed', err)
    })
  }
}
