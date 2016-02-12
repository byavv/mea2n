import {CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, FormBuilder} from 'angular2/common';
import {Component, Injector} from 'angular2/core';
import { Router, ROUTER_DIRECTIVES, OnActivate} from 'angular2/router';
import {ServerResponseHandler, IdentityService, Storage} from '../../../../common/services/services';
import {AuthApiService} from '../../services/authApi.service';
import {Alert} from '../../../../common/components/alert/alert.component';
@Component({
    selector: 'signin',
    template: require('./signin.component.html'),
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, Alert, ROUTER_DIRECTIVES]
})
export class SignInComponent implements OnActivate {
    signInForm: ControlGroup;
    error: string;
    constructor(builder: FormBuilder,
        private router: Router,
        private authService: AuthApiService,
        private storage: Storage,
        private identityService: IdentityService,
        private responseHandler: ServerResponseHandler) {
        this.signInForm = builder.group({
            "username": [""],
            "password": [""]
        });
    }

    onSubmit(value) {
        this.authService.signIn(value).subscribe(
            data => this.onSuccess(data),
            err  => this.onError(err)
        );
    }

    routerOnActivate() {
        if (this.identityService.user.isAuthenticated()) {
            this.router.navigate(['/Home']);
        }
    }

    onSuccess(data) {
        if (data && data.token) {
            this.identityService.update(data);
            this.storage.setItem("authorizationData", JSON.stringify(data))
                .then(() => {
                    this.router.navigate(['/Home']);
                });
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