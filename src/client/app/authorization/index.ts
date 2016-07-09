import { SignInComponent } from './components/signin/signin.component';
import { SignUpComponent } from './components/signup/signup.component';
import { ForgotComponent } from './components/psw_forgot/forgot.component';
import { ResetPasswordComponent } from './components/psw_reset/resetPassword.component';
import { ErrorResetPasswordComponent } from './components/psw_error/errorPasswordReset.component';
import { AuthorizationBase } from './components/authorization.base';

export * from './components/signin/signin.component';
export * from './components/signup/signup.component';
export * from './components/psw_forgot/forgot.component';
export * from './components/authorization.base';
export * from './components/psw_reset/resetPassword.component';
export * from './components/psw_error/errorPasswordReset.component';
export * from './routes';

export var AUTHORIZATION_COMPONENTS = [
    SignInComponent,
    SignUpComponent,
    ForgotComponent,
    ResetPasswordComponent,
    ErrorResetPasswordComponent,
    AuthorizationBase
]
