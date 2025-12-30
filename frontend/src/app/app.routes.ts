
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/data-capture', pathMatch: 'full' },
  {
    path: 'data-capture',
    loadChildren: () =>
      import('./modules/data-capture/data-capture.routes')
        .then(m => m.DATA_CAPTURE_ROUTES)
  },
  { path: '', redirectTo: '/data-capture', pathMatch: 'full' },
  { path: '**', redirectTo: '/data-capture' }
];
