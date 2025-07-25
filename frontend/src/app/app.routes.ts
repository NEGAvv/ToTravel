import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './core/auth/guards/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { EditComponent } from './pages/profile/edit/edit.component';
import { TouristPlaceComponent } from './pages/tourist-place/tourist-place.component';
import { ReviewComponent } from './pages/review/review.component';
import { SavedPlacesComponent } from './pages/saved-places/saved-places.component';
import { SearchPlacesComponent } from './pages/search-places/search-places.component';
import { SurveyComponent } from './pages/survey/survey.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { CreateComponent } from './pages/tourist-place/create/create.component';


export const routes: Routes = [
    {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'profile/edit', component: EditComponent },
      { path: 'places/:id', component: TouristPlaceComponent },
      { path: 'places', component: SearchPlacesComponent },
      { path: 'places/:id/review', component: ReviewComponent },
      { path: 'saved-places', component: SavedPlacesComponent },
      { path: 'survey', component: SurveyComponent },
      { path: 'admin', component: AdminPanelComponent },
      { path: 'admin/users/edit/:id', component: EditComponent},
      { path: 'create', component: CreateComponent}
    ],
    canActivate: [authGuard] 
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { pathMatch: 'full', redirectTo: 'login', path: '' }
  ];