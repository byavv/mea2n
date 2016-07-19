import { Component } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { ServerResponseHandler } from '../../../shared/services';
import { AuthApiService } from '../../services/authApi';
import { Alert } from '../../../shared/components';

@Component({
    selector: 'forgot',
    template: require('./forgot.html'),
    directives: [REACTIVE_FORM_DIRECTIVES, Alert],
    styles: [require('./style.scss')]
})
export class ForgotComponent {
    error: string;
    info: string;
    loading: boolean;
    constructor(private authApiService: AuthApiService, private responseHandler: ServerResponseHandler) { }

    onSubmit(formData) {
        this.loading = true;
        this.authApiService.forgotPassword(formData.email)
            .finally(() => { this.loading = false })
            .subscribe(
            (success) => this.onSuccess(success),
            (err) => this.onError(err));
    }

    onSuccess(info) {
        this.info = info;
        this.error = null;
    }

    onError(err) {
        this.error = err;
        this.info = null;
    }

    closeAlert() {
        this.error = null;
        this.info = null;
    }
}