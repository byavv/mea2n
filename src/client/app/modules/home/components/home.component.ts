import {CORE_DIRECTIVES} from 'angular2/common';
import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    selector: 'home',
    template: require('./home.component.html'),
    directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class HomeComponent {
    constructor() { }
}