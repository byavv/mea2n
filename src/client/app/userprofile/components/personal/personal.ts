import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, REACTIVE_FORM_DIRECTIVES, FormBuilder } from '@angular/forms';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { ServerResponseHandler } from '../../../shared/services';
import { UserApiService } from '../../services/userApi';
import { DateSelector, Alert } from '../../../shared/components';
import { ShowError } from '../../../shared/directives';

@Component({
    selector: 'personal',
    template: require('./personal.html'),
    directives: [...ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, DateSelector, Alert, ShowError]
})
export class PersonalComponent implements OnInit {
    personal = {
        name: "",
        birthday: "1/1/1990",
        address: ""
    }
    error: string = null;
    info: string = null;
    form: FormGroup;
    constructor(
        private apiService: UserApiService,
        private fBuilder: FormBuilder,
        private responseHandler: ServerResponseHandler) {
        this.form = fBuilder.group({
            birthday: [""],
            name: [""],
            address: [""],
        });
    }
    ngOnInit() {
        // this way is promised
        // this.apiService.getProfile()
        //        .subscribe(person => this.form.updateValue(person));
        this.apiService.getProfile()
            .subscribe((data) => {
                if (!!data)
                    Object.assign(this.personal, data);
            },
            err => this.onError(err))
    }

    onSubmit(value) {
        if (this.form.valid) {
            this.apiService.updateProfile(value)
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
        this.error = this.responseHandler.handleError(err);
    }
    closeAlert() {
        this.info = null;
        this.error = null;
    }
}