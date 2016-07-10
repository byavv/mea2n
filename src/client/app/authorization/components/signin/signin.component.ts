import { FORM_DIRECTIVES, ControlGroup, FormBuilder } from '@angular/common';
import { Component, Injector } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';
import { ServerResponseHandler, IdentityService, Storage } from '../../../shared/services';
import { AuthApiService } from '../../services/authApi.service';
import { Alert } from '../../../shared/components';

@Component({
    selector: 'signin',
    template: require('./signin.component.html'),
    directives: [FORM_DIRECTIVES, Alert, ROUTER_DIRECTIVES],
    styles: [require("./signin.scss")]
})
export class SignInComponent {
    signInForm: ControlGroup;
    error: string;
    constructor(builder: FormBuilder,
        private router: Router,
        private authService: AuthApiService,
        private storage: Storage,
        private identity: IdentityService,
        private responseHandler: ServerResponseHandler) {
        this.signInForm = builder.group({
            "username": [""],
            "password": [""]
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