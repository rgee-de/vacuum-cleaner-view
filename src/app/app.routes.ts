import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'vacuum-plans',
    loadComponent: () => import('./components/vacuum-plan-setup/vacuum-plan-setup.component').then(m => m.VacuumPlanSetupComponent),
    title: 'Vacuum Plans Setup'
  }
];
