import { provideRouter, RouterConfig } from '@angular/router';

import { HomeComponent } from './home/components/home.component';
import { RestrictedComponent } from './restricted/components/restricted.component';
import { UserProfileRoutes } from './userprofile';
import { AuthorizationRoutes } from './authorization';

export const routes: RouterConfig = [
  { path: '', component: HomeComponent },
  { path: 'restricted', component: RestrictedComponent, data: { secured: true } },
  ...UserProfileRoutes,
  ...AuthorizationRoutes,
  { path: '**', redirectTo: '/' }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];