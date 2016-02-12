import {
CORE_DIRECTIVES,
FORM_DIRECTIVES,
FormBuilder,
ControlGroup,
Control,
Validators,
AbstractControl} from 'angular2/common';
import {Component, OnInit} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import { ROUTER_DIRECTIVES, Router, OnActivate } from 'angular2/router';
import {SecureInput} from '../../../../common/components/securedInput/securedInput.component';
import {Alert} from '../../../../common/components/alert/alert.component'
import {ServerResponseHandler, IdentityService} from '../../../../common/services/services';
import {AuthApiService} from '../../services/authApi.service';
import * as appValidators from '../../../../lib/formValidators';
import {APP_DIRECTIVES} from '../../../../common/directives/directives';

@Component({
    selector: 'signup',
    template: require('./signup.component.html'),
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES, SecureInput, Alert, APP_DIRECTIVES],
    providers: [AuthApiService, IdentityService, ServerResponseHandler]
})
export class SignUpComponent implements OnActivate {
    submitted: boolean = false;
    signUpForm: ControlGroup;
    error: string;
    password1: string;
    formData: any;
    constructor(builder: FormBuilder,
        private authService: AuthApiService,
        private identityService: IdentityService,
        private responseHandler: ServerResponseHandler,
        private router: Router) {
        this.signUpForm = builder.group({
            username: ["", Validators.required],
            email: ["", Validators.compose([
                Validators.required,
                appValidators.emailValidator
            ])],
            password: ["", Validators.compose([
                Validators.required,
                Validators.minLength(6)
            ])]
        });
    }

    onSubmit(value) {
        this.submitted = true;
        if (this.signUpForm.valid) {
            this.authService.signUp(value).subscribe(
                data => this.onSuccess(data),
                err  => this.onError(err)
            );
        }
    }

    routerOnActivate() {
        if (this.identityService.user.isAuthenticated()) {
            this.router.navigate(['/Home']);
        }
    }

    onSuccess(data) {
        if (data && data.token) {
            this.identityService.update(data);
            this.router.navigate(['/Home']);
        }
    }

    onError(err) {
        this.error = this.responseHandler.handleError(err);
    }

    closeAlert() {
        this.error = null;
    }
}
