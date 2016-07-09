import {FORM_DIRECTIVES} from '@angular/common';
import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
    selector: 'pswerr',
    template: require('./errorPasswordReset.component.html'),
    directives: [ROUTER_DIRECTIVES]
})
export class ErrorResetPasswordComponent {
    error: string;
    constructor() {
        this.error = "Token is expired";
    }
}