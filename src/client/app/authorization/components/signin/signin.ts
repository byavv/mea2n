import { FormGroup, REACTIVE_FORM_DIRECTIVES, FormBuilder, Validators } from '@angular/forms';
import { Component, Injector } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';
import { ServerResponseHandler, IdentityService, Storage } from '../../../shared/services';
import { AuthApiService } from '../../services/authApi';
import { Alert } from '../../../shared/components';

@Component({
    selector: 'signin',
    template: require('./signin.html'),
    directives: [REACTIVE_FORM_DIRECTIVES, Alert, ...ROUTER_DIRECTIVES],
    styles: [require("./signin.scss")]
})
export class SignInComponent {
    signInForm: FormGroup;
    error: string;
    constructor(fBuilder: FormBuilder,
        private router: Router,
        private authService: AuthApiService,
        private storage: Storage,
        private identity: IdentityService,
        private responseHandler: ServerResponseHandler) {
        this.signInForm = fBuilder.group({
            username: [""],
            password: [""]
        });
    }

    onSubmit(value) {
        this.authService.signIn(value).subscribe(
            data => this.onSuccess(data),
            err => this.onError(err)
        );
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