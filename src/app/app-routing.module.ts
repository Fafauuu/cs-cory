import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tactics'
  },
  {
    path: 'tactics',
    loadComponent: () => import('./tactics/tactics.component').then(m => m.TacticsComponent)
  },
  {
    path: 'analysis',
    loadComponent: () => import('./analysis/analysis.component').then(m => m.AnalysisComponent)
  }
];
