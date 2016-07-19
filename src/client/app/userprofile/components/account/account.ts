import { FormGroup, REACTIVE_FORM_DIRECTIVES, FormBuilder, Validators, ControlValueAccessor } from '@angular/forms';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { emailValidator, passwordLongerThen6IfExists } from '../../../lib/formValidators';

import { ServerResponseHandler, IdentityService, ExtHttp } from '../../../shared/services';
import { UserApiService } from '../../services/userApi';
import { SecureInput, Alert } from '../../../shared/components';
import { ShowError } from '../../../shared/directives';

@Component({
    selector: 'account',
    template: require('./account.html'),
    directives: [REACTIVE_FORM_DIRECTIVES, Alert, SecureInput]
})
export class AccountComponent implements OnInit {
    submitted: boolean = false;
    signUpForm: FormGroup;
    showAccountForm: boolean;
    error: string;
    info: string;
    account: any = {};

    constructor(builder: FormBuilder,
        private http: ExtHttp,
        private apiService: UserApiService,
        private responseHandler: ServerResponseHandler) {
        this.showAccountForm = false;
        this.signUpForm = builder.group({
            username: ["", Validators.required],
            email: ["", Validators.compose([
                Validators.required,
                emailValidator
            ])],
            oldpassword: ["", Validators.required],
            newpassword: ["", passwordLongerThen6IfExists]
        });
    }

    ngOnInit() {
        this.apiService.getUserAccount()
            .subscribe(
            data => {
                data.provider == 'local'
                    ? this.showAccountForm = true
                    : this.showAccountForm = false;
                this.account = data
            },
            err => this.onError(err))
    }

    onSubmit(value) {
        this.submitted = true;
        if (this.signUpForm.valid) {
            this.apiService.updateUserAccount(value)
                .subscribe(
                data => this.onSuccess(data),
                err => this.onError(err))
        }
    }

    onSuccess(info) {
        this.error = null;
        this.info = info;
    }

    onError(err) {
        this.info = null;
        this.error = err;
    }

    closeAlert() {
        this.info = null;
        this.error = null;
    }
}