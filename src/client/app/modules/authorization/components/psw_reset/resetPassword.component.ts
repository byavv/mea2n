import {Component} from 'angular2/core';
import {FORM_DIRECTIVES, ControlGroup, Control, Validators} from 'angular2/common';
import { Router, ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';
import {ServerResponseHandler} from '../../../../common/services/services';
import {AuthApiService} from '../../services/authApi.service';
import {SecureInput} from '../../../../common/components/securedInput/securedInput.component';
import {Alert} from '../../../../common/components/alert/alert.component';

@Component({
    selector: 'forgot',
    template: require('./resetPassword.component.html'),
    directives: [FORM_DIRECTIVES, SecureInput, Alert, ROUTER_DIRECTIVES]
})
export class ResetPasswordComponent {
    error: string;
    info: string;
    passwordForm: ControlGroup;
    redirectTime: number = 5;
    countdown: boolean;
    constructor(
        private authApiService: AuthApiService,
        private params: RouteParams,
        private responseHandler: ServerResponseHandler,
        private router: Router) {
        this.passwordForm = new ControlGroup({
            "password": new Control("", Validators.compose([
                Validators.required, Validators.minLength(6)
            ]))
        })
    }
    onSubmit(formData) {
        this.authApiService.setNewPassword(formData.password, this.params.get("token"))
            .subscribe(
            (success) => this.onSuccess(success),
            (err) => this.onError(err));
    }

    onSuccess(data) {
        this.info = this.responseHandler.handleSuccess(data);
        this.countdown = true;
        var timer = setInterval(() => {
            if (this.redirectTime == 0) {
                clearInterval(timer);
                this.countdown = false;
                this.router.navigate(["Signin"]);
            } else {
                this.redirectTime--;
            }
        }, 1000);
    }

    onError(err) {
        this.router.navigate(["PswError"]);
    }

    closeAlert() {
        this.error = null;
        this.info = null;
    }
}