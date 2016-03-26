import {Component} from 'angular2/core'
import {CanActivate, OnActivate} from 'angular2/router';
import {Http, ConnectionBackend, RequestOptions} from 'angular2/http';
import {PermissionService} from '../../../common/services/services';


@Component({
    selector: 'restricted',
    template: require('./restricted.component.html'),
    directives: []
})
export class RestrictedComponent {
    constructor(private permission: PermissionService) { }
    routerOnActivate() {       
       this.permission.isAuthorized(["user"])
    }
}

