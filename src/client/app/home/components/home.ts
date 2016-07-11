import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
    selector: 'home',
    template: require('./home.html'),
    directives: [...ROUTER_DIRECTIVES]
})
export class HomeComponent {
    constructor() { }
}