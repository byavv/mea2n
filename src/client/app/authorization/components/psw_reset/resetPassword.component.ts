import { Component } from '@angular/core';
import { FormGroup, REACTIVE_FORM_DIRECTIVES, FormBuilder, Validators } from '@angular/forms';
import { Router, ROUTER_DIRECTIVES, ActivatedRoute } from '@angular/router';
import { ServerResponseHandler } from '../../../shared/services';
import { AuthApiService } from '../../services/authApi.service';
import { Alert, SecureInput } from '../../../shared/components/';
import { ShowError } from '../../../shared/directives';

@Component({
    selector: 'forgot',
    template: require('./resetPassword.component.html'),
    directives: [REACTIVE_FORM_DIRECTIVES, SecureInput, Alert, ROUTER_DIRECTIVES, ShowError]
})
export class ResetPasswordComponent {
    error: string;
    info: string;
    passwordForm: FormGroup;
    redirectTime: number = 5;
    countdown: boolean;
    constructor(
        private authApiService: AuthApiService,
        private route: ActivatedRoute,
        private responseHandler: ServerResponseHandler,
        private fBuilder: FormBuilder,
        private router: Router) {
        this.passwordForm = fBuilder.group({
            password: ["", Validators.compose([Validators.required, Validators.minLength(6)])]
        });
    }
    onSubmit(formData) {      
        this.authApiService.setNewPassword(formData.password, this.route.snapshot.params['token'])
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