import {Component, OnInit, AfterViewInit} from '@angular/core';
import {ControlGroup, Control, FORM_DIRECTIVES} from '@angular/common';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {ServerResponseHandler} from '../../../common/services';
import {UserApiService} from '../../services/userApi.service';
import {DateSelector} from '../../../common/components/dateSelector/dateSelector.component';
import {Alert} from '../../../common/components/alert/alert.component';

@Component({
    selector: 'personal',
    template: require('./personal.component.html'),
    directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES, DateSelector, Alert]
})
export class PersonalComponent implements OnInit, AfterViewInit {
    personal = {
        name: "",
        birthday: "1/1/1990",
        address: ""
    }
    error: string = null;
    info: string = null;
    form: ControlGroup;
    constructor(
        private apiService: UserApiService,
        private responseHandler: ServerResponseHandler) {
        this.form = new ControlGroup({
            "birthday": new Control(""),
            "name": new Control(""),
            "address": new Control("")
        });
    }
    ngOnInit() {
        //this._getProfileData();
    }
    //temp untill #4112 is resolved
    ngAfterViewInit(){
         this._getProfileData();
    }
    _getProfileData() {
        this.apiService.getProfile()
            .subscribe((data) => {                
                if (!!data)
                    Object.assign(this.personal, data);
            },
            err  => this.onError(err))
    }
    onSubmit(value) {
        if (this.form.valid) {
            this.apiService.updateProfile(value)
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