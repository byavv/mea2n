import * as Rx from 'rxjs';
import {Component, OnInit} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, OnActivate, OnReuse, CanReuse, CanActivate} from 'angular2/router';
import {Http, Headers} from 'angular2/http';

import {SignInComponent} from './components/signin/signin.component';
import {SignUpComponent} from './components/signup/signup.component';
import {ForgotComponent} from './components/psw_forgot/forgot.component';
import {ResetPasswordComponent} from './components/psw_reset/resetPassword.component';
import {ErrorResetPasswordComponent} from './components/psw_error/errorPasswordReset.component';
import {AuthApiService} from "./services/authApi.service";
/** 
 * Authentication Component 
 */
@Component({
    selector: 'auth',
    directives: [ROUTER_DIRECTIVES],
    template: `
    <section>
      <router-outlet>
      </router-outlet>
    </section>
  `,
    providers: [AuthApiService]
})
@RouteConfig([
    { path: '/signin', name: 'Signin', component: SignInComponent },
    { path: '/signup', name: 'Signup', component: SignUpComponent },
    { path: '/forgot', name: 'Forgot', component: ForgotComponent },
    { path: '/reset/:token', name: 'Reset', component: ResetPasswordComponent },
    { path: '/error', name: 'PswError', component: ErrorResetPasswordComponent },

])
export class AuthorizationModule {}

export var AUTH_MODULE: Array<any> = [
    AuthorizationModule, AuthApiService
];

