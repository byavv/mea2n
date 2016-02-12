import {CORE_DIRECTIVES, FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {Component, OnInit, AfterViewInit} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {emailValidator, passwordLongerThen6IfExists} from '../../../../lib/formValidators';

import {ServerResponseHandler, IdentityService, ExtHttp} from '../../../../common/services/services';
import {UserApiService} from '../../services/userApi.service';
import {SecureInput} from '../../../../common/components/securedInput/securedInput.component';
import {Alert} from '../../../../common/components/alert/alert.component';

@Component({
    selector: 'account',
    template: require('./account.component.html'),
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, Alert, SecureInput]
})
export class AccountComponent implements OnInit, AfterViewInit{
    submitted: boolean = false;
    signUpForm: ControlGroup;
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
       //this._getAccountData();
    }
    //temp untill #4112 is resolved
    ngAfterViewInit(){
         this._getAccountData();
    }
    _getAccountData() {
        this.apiService.getUserAccount()
            .subscribe(
            data => {
                data.provider == 'local'
                    ? this.showAccountForm = true
                    : this.showAccountForm = false;
                this.account = data
            },
            err  => this.onError(err))
    }
    onSubmit(value) {
        this.submitted = true;
        if (this.signUpForm.valid) {
            this.apiService.updateUserAccount(value)
                .subscribe(
                data => this.onSuccess(data),
                err  => this.onError(err))
        }
    }
    onSuccess(data) {
        this.error = null;
        this.info = this.responseHandler.handleSuccess(data);
    }
    onError(err) {
        this.info = null;
        this.error = this.responseHandler.handleError(err);
    }
    closeAlert() {
        this.info = null;
        this.error = null;
    }
}