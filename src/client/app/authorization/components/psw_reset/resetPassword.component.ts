import { Component } from '@angular/core';
import { FORM_DIRECTIVES, ControlGroup, Control, Validators } from '@angular/common';
import { Router, ROUTER_DIRECTIVES, Params, ActivatedRoute } from '@angular/router';
import { ServerResponseHandler } from '../../../shared/services';
import { AuthApiService } from '../../services/authApi.service';
import { Alert, SecureInput } from '../../../shared/components/';

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
        private route: ActivatedRoute,
        private params: Params,//this.route.snapshot.params['id']
        private responseHandler: ServerResponseHandler,
        private router: Router) {
        this.passwordForm = new ControlGroup({
            "password": new Control("", Validators.compose([
                Validators.required, Validators.minLength(6)
            ]))
        })
    }
    onSubmit(formData) {
        this.authApiService.setNewPassword(formData.password, this.params["token"])
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
                this.router.navigate(["auth/signin"]);
            } else {
                this.redirectTime--;
            }
        }, 1000);
    }

    onError(err) {
        this.router.navigate(["/auth/error"]);
    }

    closeAlert() {
        this.error = null;
        this.info = null;
    }
}