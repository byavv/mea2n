import { SignInComponent } from './components/signin/signin';
import { SignUpComponent } from './components/signup/signup';
import { ForgotComponent } from './components/psw_forgot/forgot';
import { ResetPasswordComponent } from './components/psw_reset/resetPassword';
import { ErrorResetPasswordComponent } from './components/psw_error/errorPasswordReset';
import { AuthorizationBase } from './components/authorization.base';

export * from './components/signin/signin';
export * from './components/signup/signup';
export * from './components/psw_forgot/forgot';
export * from './components/authorization.base';
export * from './components/psw_reset/resetPassword';
export * from './components/psw_error/errorPasswordReset';
export * from './routes';

export var AUTHORIZATION_COMPONENTS = [
    SignInComponent,
    SignUpComponent,
    ForgotComponent,
    ResetPasswordComponent,
    ErrorResetPasswordComponent,
    AuthorizationBase
]
