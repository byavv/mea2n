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
import {SecureInput} from '../../../common/components/securedInput/securedInput.component';
import {Alert} from '../../../common/components/alert/alert.component'
import {ServerResponseHandler, IdentityService, Storage} from '../../../common/services';
import {AuthApiService} from '../../services/authApi.service';
import * as appValidators from '../../../lib/formValidators';
import {APP_DIRECTIVES} from '../../../common/directives';

@Component({
    selector: 'signup',
    template: require('./signup.component.html'),
    directives: [FORM_DIRECTIVES, ROUTER_DIRECTIVES, SecureInput, Alert, APP_DIRECTIVES]
})
export class SignUpComponent {
    submitted: boolean = false;
    signUpForm: ControlGroup;
    error: string;
    formData: any;
    constructor(builder: FormBuilder,
        private authService: AuthApiService,
        private identityService: IdentityService,
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

    /* routerOnActivate() {
         if (this.identityService.user.isAuthenticated()) {
             this.router.navigate(['/Home']);
         }
     }*/

    onSuccess(data) {
        if (data && data.token) {
            this.storage.setItem("authorizationData", JSON.stringify(data))
            this.identityService.update(data);
            this.router.navigate(['/Home']);

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
