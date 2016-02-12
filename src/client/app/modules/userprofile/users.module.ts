import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig, CanActivate, CanReuse, OnActivate, OnReuse} from 'angular2/router';
import {PersonalComponent} from './components/personal/personal.component';
import {AccountComponent} from './components/account/account.component';
import {PermissionService} from '../../common/services/services';
import {UserApiService, USER_API_SERVICE_PROVIDERS} from "./services/userApi.service";

@Component({
    selector: 'personal',
    template: `
  <div class='row'>
      <div class='col-md-3'>
          <div class="list-group">
              <a [routerLink]="['./Personal']" class="list-group-item">Personal</a>
              <a [routerLink]="['./Account']" class="list-group-item">Account</a>
          </div>
      </div>
       <div class='col-md-9'>
              <router-outlet>
              </router-outlet>
       </div>
 </div>`,
    directives: [ROUTER_DIRECTIVES],
    styles: [
        `.router-link-active { background:cornsilk !important; }`
    ],
    providers: [UserApiService]
})
@RouteConfig([
    { path: '/personal', name: 'Personal', useAsDefault: true, component: PersonalComponent },
    { path: '/account', name: 'Account', component: AccountComponent }
])
//@CanActivate(() => checkIfUserHasPermission(["user"]))
export class UserProfileModule implements OnActivate {
    constructor(private permission: PermissionService) { }
    // bad option, but best untill https://github.com/angular/angular/issues/4112    
    routerOnActivate() {
        // should be in CanActivate
        this.permission.isAuthorized(["user"]);
    }
}

export var USERS_MODULE: Array<any> = [
    UserProfileModule, USER_API_SERVICE_PROVIDERS
];
