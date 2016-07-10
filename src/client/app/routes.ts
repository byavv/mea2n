import { provideRouter, RouterConfig } from '@angular/router';
import { HomeComponent } from './home/components/home.component';
import { RestrictedComponent } from './restricted/components/restricted.component';
import { UserProfileRoutes } from './userprofile';
import { AuthorizationRoutes } from './authorization';
import { GUARDS, AuthGuard } from "./shared/routing";
import { PERMISSION_SERVICE_PRIVIDERS } from "./shared/services";

export const routes: RouterConfig = [
  { path: '', component: HomeComponent },
  {
    path: 'restricted',
    component: RestrictedComponent,
    data: { permission: ["user"] },
    canActivate: [AuthGuard]
  },
  ...UserProfileRoutes,
  ...AuthorizationRoutes,
  { path: '**', redirectTo: '/' }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes),
  ...GUARDS
];