import {
    FORM_DIRECTIVES,
    FormBuilder,
    ControlGroup,
    Control,
    Validators,
    AbstractControl} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {Http, Headers} from '@angular/http';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import {SecureInput} from '../../../shared/components/securedInput/securedInput.component';
import {Alert} from '../../../shared/components/alert/alert.component'
import {ServerResponseHandler, IdentityService, Storage} from '../../../shared/services';
import {AuthApiService} from '../../services/authApi.service';
import * as appValidators from '../../../lib/formValidators';
import {APP_DIRECTIVES} from '../../../shared/directives';

@Component({
    selector: 'signup',
    template: require('./signup.component.html'),
    directives: [FORM_DIRECTIVES, ROUTER_DIRECTIVES, SecureInput, Alert, APP_DIRECTIVES],
    styles: [require("./signin.scss")]
})
export class SignUpComponent {
    submitted: boolean = false;
    signUpForm: ControlGroup;
    error: string;
    formData: any;
    constructor(builder: FormBuilder,
        private authService: AuthApiService,
        private identity: IdentityService,
        private responseHandler: ServerResponseHandler,
        private router: Router,
        private storage: Storage) {
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
                err => this.onError(err)
            );
        }
    }

    ngOnInit() {
        if (this.identity.user.isAuthenticated()) {
            this.router.navigate(['/']);
        }
    }

    onSuccess(data) {
        if (data && data.token) {
            this.storage.setItem("authorizationData", JSON.stringify(data))
            this.identity.update(data);
            this.router.navigate(['/']);

        } else {
            this.error = "Unexpected server error";
        }
    }

    onError(err) {
        this.error = this.responseHandler.handleError(err);
    }

    closeAlert() {
        this.error = null;
    }
}
