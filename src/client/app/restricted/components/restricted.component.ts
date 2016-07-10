import { Component } from '@angular/core'
import { CanActivate } from '@angular/router';
import { PermissionService } from '../../shared/services';

@Component({
    selector: 'restricted',
    template: require('./restricted.component.html'),
    directives: []
})
export class RestrictedComponent {
    constructor() { }    
}

