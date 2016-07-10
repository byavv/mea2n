import { provideRouter, RouterConfig } from '@angular/router';
import { HomeComponent } from './home/components/home.component';
import { RestrictedComponent } from './restricted/components/restricted.component';
import { UserProfileRoutes } from './userprofile';
import { AuthorizationRoutes } from './authorization';
import { AuthGuard } from "./app.guards";
import { PERMISSION_SERVICE_PRIVIDERS } from "./common/services";

export const routes: RouterConfig = [
  { path: '', component: HomeComponent },
  { path: 'restricted', component: RestrictedComponent, data: { permission: ["user"] }, canActivate: [AuthGuard] },
  ...UserProfileRoutes,
  ...AuthorizationRoutes,
  { path: '**', redirectTo: '/' }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes),
  AuthGuard,
  //PERMISSION_SERVICE_PRIVIDERS
];