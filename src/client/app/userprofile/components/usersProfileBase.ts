import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {PermissionService} from '../../common/services';
import {UserApiService} from "../services/userApi.service";

@Component({
    selector: 'personal',
    template: `
  <div class='row'>
      <div class='col-md-3'>
          <div class="list-group">
              <a [routerLink]="['/personal']" class="list-group-item">Personal</a>
              <a [routerLink]="['/account']" class="list-group-item">Account</a>
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

export class UserProfileBase {
    constructor(private permission: PermissionService) { }
    // bad option, but best untill https://github.com/angular/angular/issues/4112    
  /*  routerOnActivate() {
        // should be in CanActivate
        this.permission.isAuthorized(["user"]);
    }*/
}

