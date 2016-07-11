import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { UserApiService } from "../services/userApi";

@Component({
    selector: 'personal',
    template: `
        <div class='row'>
            <div class='col-md-3'>
                <div class="list-group">
                    <a [routerLink]="['./personal']" routerLinkActive="active" class="list-group-item">Personal</a>
                    <a [routerLink]="['./account']" routerLinkActive="active" class="list-group-item">Account</a>
                </div>
            </div>
            <div class='col-md-9'>
                    <router-outlet>
                    </router-outlet>
            </div>
        </div>`,
    directives: [...ROUTER_DIRECTIVES],
    styles: [
        `.active { font-size: 1.05em; }`
    ],
    providers: [UserApiService]
})

export class UserProfileBase {
    constructor() { }
}
