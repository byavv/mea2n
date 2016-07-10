import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, NavigationStart, NavigationEnd, ActivatedRoute, PRIMARY_OUTLET } from '@angular/router';
import { IdentityService, Storage } from '../../services';
import { DROPDOWN_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';
import { Subscription } from "rxjs";

@Component({
    selector: 'app-header',
    template: require('./header.html'),
    directives: [ROUTER_DIRECTIVES, DROPDOWN_DIRECTIVES],
    styles: [require('./header.scss')]
})
export class Header {
    isAuthenticated: boolean = false;
    redirectUrl: string;
    sub: Subscription;
    constructor(private identity: IdentityService, private localStorage: Storage, private router: Router, private activated: ActivatedRoute) {
        identity.dispatch$
            .subscribe((user) => {
                this.isAuthenticated = user.isAuthenticated();
            });
        // see this discussion https://github.com/angular/angular/issues/9662
        this.sub = this.router.events
            .filter(event => event instanceof NavigationEnd)
            .map(_ => this.router.routerState)
            .map(state => state.firstChild(this.activated))
            .filter(route => route.outlet === PRIMARY_OUTLET)
            .flatMap(route => route.data)
            .subscribe(data => {
                this.redirectUrl = data['redirectWhenLogOut'];
            });
    }
    signOut() {
        this.localStorage.removeItem("authorizationData");
        this.identity.update(null);
        if (this.redirectUrl) {
            this.router.navigate([this.redirectUrl]);
        }
    }
}
