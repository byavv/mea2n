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
    /**
     * permission: 
     *    - only users in defined in role are allowed
     * redirectWhenLogOut:
     *    - when user logs out being on this page, redirect to defined url  
     */
    data: { permission: ["user"], redirectWhenLogOut: "/" },
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