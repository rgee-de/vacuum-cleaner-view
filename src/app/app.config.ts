import {ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {RoomStoreService} from './services/room-store.service';
import {provideHttpClient} from '@angular/common/http';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import Lara from '@primeng/themes/lara';
import {CleaningModesStoreService} from './services/cleaning-modes-store.service';
import {PropertiesStoreService} from './services/properties-store.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(),
    RoomStoreService,
    CleaningModesStoreService,
    PropertiesStoreService,

    provideAppInitializer(() => inject(RoomStoreService).load()),
    provideAppInitializer(() => inject(CleaningModesStoreService).load()),
    provideAppInitializer(() => inject(PropertiesStoreService).load()),

    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Lara
      }
    })
  ]
};
