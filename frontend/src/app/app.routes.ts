
import { Routes } from '@angular/router';


export const routes: Routes = [
  { path: 'protocol', loadChildren: () => import('./modules/protocol/protocol.routes').then(m => m.PROTOCOL_ROUTES) },
  { path: '', redirectTo: 'protocol', pathMatch: 'full' },
  { path: '**', redirectTo: 'protocol' }
];
