import { RouterConfig } from '@angular/router';
import {
    SignInComponent,
    SignUpComponent,
    ForgotComponent,
    AuthorizationBase,
    ResetPasswordComponent,
    ErrorResetPasswordComponent } from './';

export const AuthorizationRoutes: RouterConfig = [
    {
        path: 'auth',
        component: AuthorizationBase,
        data: { redirectWhenLogOut: "/" },
        children: [
            {
                path: 'signin',
                component: SignInComponent
            },
            {
                path: 'signup',
                component: SignUpComponent
            },
            {
                path: 'forgot',
                component: ForgotComponent
            },
            {
                path: 'reset/:token',
                component: ResetPasswordComponent
            },
            {
                path: 'error',
                component: ErrorResetPasswordComponent
            }
        ]
    }
];
