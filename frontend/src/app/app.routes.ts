import { Routes } from '@angular/router';
import { PlaceListComponent } from './components/place-list.component';

export const routes: Routes = [
    { path: '', redirectTo: 'places', pathMatch: 'full' },
    { path: 'places', component: PlaceListComponent }
  ];