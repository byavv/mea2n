import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    selector: 'home',
    template: require('./home.component.html'),
    directives: [ROUTER_DIRECTIVES]
})
export class HomeComponent {
    constructor() { }
}