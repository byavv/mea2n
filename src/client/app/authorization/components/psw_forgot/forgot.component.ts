import {Component} from '@angular/core';
import {FORM_DIRECTIVES} from "@angular/common";
import {ServerResponseHandler} from '../../../shared/services';
import {AuthApiService} from '../../services/authApi.service';
import {Alert} from '../../../shared/components/alert/alert.component';

@Component({
    selector: 'forgot',
    template: require('./forgot.component.html'),
    directives: [FORM_DIRECTIVES, Alert],
    styles: [require('!raw!./style.less')]
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

    onSuccess(data) {
        this.info = this.responseHandler.handleSuccess(data);
        this.error = null;
    }

    onError(err) {
        this.error = this.responseHandler.handleError(err);
        this.info = null;
    }

    closeAlert() {
        this.error = null;
        this.info = null;
    }
}