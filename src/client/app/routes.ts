import { provideRouter, RouterConfig, Route } from '@angular/router';
import { HomeComponent } from './home/components/home';
import { SecuredPageComponent } from './secured';
import { UserProfileRoutes } from './userprofile';
import { AuthorizationRoutes } from './authorization';
import { GUARDS, AuthGuard } from "./shared/routing";
import { PERMISSION_SERVICE_PRIVIDERS } from "./shared/services";

export const routes: RouterConfig = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'secured',
    component: SecuredPageComponent,
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
  provideRouter(routes/*, { enableTracing: true }*/),
  ...GUARDS
];