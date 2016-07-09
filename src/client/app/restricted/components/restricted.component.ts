import { Component } from '@angular/core'
import { CanActivate } from '@angular/router';
import { PermissionService } from '../../common/services';


@Component({
    selector: 'restricted',
    template: require('./restricted.component.html'),
    directives: []
})
export class RestrictedComponent {
    constructor(private permission: PermissionService) { }
    /* routerOnActivate() {       
        this.permission.isAuthorized(["user"])
     }*/
}

