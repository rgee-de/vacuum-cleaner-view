import {computed, effect, inject, Injectable, signal} from '@angular/core';
import {CleaningConfig, CleaningModesModel, CleaningPreset, defaultCleaningModes} from '../models/cleaning-modes.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

const STORAGE_KEY = 'selectedCleaningPreset';

@Injectable({
  providedIn: 'root'
})
export class CleaningModesStoreService {
  readonly availablePresets: CleaningPreset[] = [
    {
      name: 'Custom',
      mode: 'Custom',
      fan_power: 106,
      water_box_mode: 204,
      mop_mode: 302,
    },
    {
      name: 'Turbo Vac',
      mode: 'Vac',
      fan_power: 108,
      water_box_mode: 200,
      mop_mode: 300,
    },
    {
      name: 'Silent Vac',
      mode: 'Vac',
      fan_power: 101,
      water_box_mode: 200,
      mop_mode: 300,
    },
    {
      name: 'Intensive Mop',
      mode: 'Mop',
      fan_power: 105,
      water_box_mode: 202,
      mop_mode: 303,
    },
    {
      name: 'Vac & Mop',
      mode: 'Vac&Mop',
      fan_power: 104,
      water_box_mode: 202,
      mop_mode: 300,
    },
  ];
  readonly availablePresetNames = this.availablePresets.map((preset) => preset.name);
  private readonly http = inject(HttpClient);
  private readonly _modes = signal<CleaningModesModel>(defaultCleaningModes)
  readonly modes = this._modes.asReadonly();
  private readonly _selectedPresetName = signal<string>(this._loadSelectedPresetFromStorage() ?? 'Custom');
  readonly selectedPresetName = this._selectedPresetName.asReadonly();
  readonly currentSelectedConfig = computed<CleaningConfig>(() => {
    const preset =
      this.availablePresets.find((p) => p.name === this._selectedPresetName()) ??
      this.availablePresets[0];
    const {name: _, ...config} = preset;
    return config;
  });

  constructor() {
    effect(() => {
      localStorage.setItem(STORAGE_KEY, this._selectedPresetName());
    });
  }

  load(): void {
    this.http.get<CleaningModesModel>(environment.apiEndpoint + 'modes').subscribe({
      next: data => this._modes.set(data),
      error: err => console.error('[CleaningModesStore] load failed', err)
    })
  }

  setPreset(presetName: string) {
    this._selectedPresetName.set(presetName);
  }

  private _loadSelectedPresetFromStorage(): string | null {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ?? null;
  }
}
