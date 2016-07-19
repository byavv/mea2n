import { FormGroup, REACTIVE_FORM_DIRECTIVES, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { SecureInput, Alert } from '../../../shared/components';
import { ShowError } from '../../../shared/directives';

import { ServerResponseHandler, IdentityService, Storage } from '../../../shared/services';
import { AuthApiService } from '../../services/authApi';
import { emailValidator } from '../../../lib/formValidators';
import { APP_DIRECTIVES } from '../../../shared/directives';

@Component({
    selector: 'signup',
    template: require('./signup.html'),
    directives: [REACTIVE_FORM_DIRECTIVES, ...ROUTER_DIRECTIVES, SecureInput, Alert, APP_DIRECTIVES, ShowError],
    styles: [require("./signin.scss")]
})
export class SignUpComponent {
    submitted: boolean = false;
    signUpForm: FormGroup;
    error: string;
    formData: any = {
        username: "",
        email: "",
        password: ""
    };
    constructor(builder: FormBuilder,
        private authService: AuthApiService,
        private identity: IdentityService,
        private responseHandler: ServerResponseHandler,
        private router: Router,
        private storage: Storage) {
        this.signUpForm = builder.group({
            username: ["", Validators.required],
            email: ["", Validators.compose([Validators.required, emailValidator])],
            password: ["", Validators.compose([Validators.required, Validators.minLength(6)])]
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
        this.error = err;
    }

    closeAlert() {
        this.error = null;
    }
}
