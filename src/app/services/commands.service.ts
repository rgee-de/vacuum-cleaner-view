import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {CleaningModesStoreService} from './cleaning-modes-store.service';
import {switchMap} from 'rxjs';
import {RepeatStoreService} from './repeat-store.service';

@Injectable({
  providedIn: 'root'
})
export class CommandsService {
  private readonly http = inject(HttpClient);
  private readonly repeatStore = inject(RepeatStoreService);
  private readonly cleaningModesStore = inject(CleaningModesStoreService);

  gotoMaintenancePoint() {
    return this.http.post<any>(environment.apiEndpoint + 'goto/maintenance', {});
  }

  gotoChargePoint() {
    return this.http.post<any>(environment.apiEndpoint + 'goto/charge', {});
  }

  stop() {
    return this.http.post<any>(environment.apiEndpoint + 'stop', {});
  }

  pause() {
    return this.http.post<any>(environment.apiEndpoint + 'pause', {});
  }

  setMode() {
    return this.http.post(environment.apiEndpoint + 'clean/settings', this.cleaningModesStore.currentSelectedConfig());
  }

  cleanSegmentsCustom(segment_ids: number[]) {
    return this.http.post(environment.apiEndpoint + 'clean/settings', this.cleaningModesStore.currentSelectedConfig()).pipe(
      switchMap(() =>
        this.http.post(environment.apiEndpoint + 'clean/segments', {
          segment_ids,
          repeat: this.repeatStore.numberOfRepetition()
        })
      )
    );
  }
}
