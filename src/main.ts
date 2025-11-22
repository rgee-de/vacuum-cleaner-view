import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {AppComponent} from './app/app.component';

/* eslint-disable unicorn/prefer-top-level-await */
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
