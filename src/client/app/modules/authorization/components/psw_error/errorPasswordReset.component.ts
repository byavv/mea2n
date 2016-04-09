import {FORM_DIRECTIVES} from 'angular2/common';
import {Component} from "angular2/core";
import {ROUTER_DIRECTIVES} from 'angular2/router';

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