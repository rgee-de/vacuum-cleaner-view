import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {CleaningModesStoreService} from './cleaning-modes-store.service';
import {switchMap} from 'rxjs';
import { VacuumPlanModel } from '../models/vacuum-plan.model';

@Injectable({
  providedIn: 'root'
})
export class CommandsService {
  private readonly http = inject(HttpClient);
  private readonly cleaningModesStore = inject(CleaningModesStoreService);
  private readonly _cleaningModes = this.cleaningModesStore.modes

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

  cleanSegmentsCustom(segment_ids: [number], repeat: number = 1) {
    const modeName = 'Custom' as const;
    const modes = this._cleaningModes();

    return this.http.post(environment.apiEndpoint + 'clean/settings', {
      mode: modeName,
      fan_power: modes[modeName].fan_power[0],
      water_box_mode: modes[modeName].water_box_mode[0],
      mop_mode: modes[modeName].mop_mode[0]
    }).pipe(
      switchMap(() =>
        this.http.post(environment.apiEndpoint + 'clean/segments', {segment_ids, repeat})
      )
    );
  }

  executeVacuumPlan(plan: VacuumPlanModel) {
    return this.http.post(environment.apiEndpoint + 'clean/settings', {
      mode: 'Custom', // Assuming 'Custom' mode for specific settings
      fan_power: plan.settings.fan_power,
      water_box_mode: plan.settings.water_box_mode,
      mop_mode: plan.settings.mop_mode
    }).pipe(
      switchMap(() =>
        this.http.post(environment.apiEndpoint + 'clean/segments', {
          segment_ids: plan.roomIds,
          repeat: plan.cycles
        })
      )
    );
  }
}
