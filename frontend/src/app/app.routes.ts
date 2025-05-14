import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './core/auth/guards/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { EditComponent } from './pages/profile/edit/edit.component';
import { TouristPlaceComponent } from './pages/tourist-place/tourist-place.component';


export const routes: Routes = [
    {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'profile/edit', component: EditComponent },
      { path: 'places/:id', component: TouristPlaceComponent },

    ],
    canActivate: [authGuard] 
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { pathMatch: 'full', redirectTo: 'login', path: '' }
  ];