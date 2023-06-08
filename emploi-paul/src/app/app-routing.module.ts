import { NgModule } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterModule,
  RouterStateSnapshot,
  Routes,
} from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import {
  canActivate,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';
import { JobOffersComponent } from './pages/job-offers/job-offers.component';
import { SavedJobOffersComponent } from './pages/saved-job-offers/saved-job-offers.component';
const redirectUnauthorizedToLogin = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return redirectUnauthorizedTo(`/login?redirectTo=${state.url}`);
};

const redirectToHome = () => redirectLoggedInTo(['']);

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    ...canActivate(redirectToHome),
  },
  {
    path: 'register',
    component: RegisterComponent,
    ...canActivate(redirectToHome),
  },
  {
    path: 'job-offers/:profession',
    component: JobOffersComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'saved-job-offers',
    component: SavedJobOffersComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'saved-job-offers/:savedJobOfferId',
    component: SavedJobOffersComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
