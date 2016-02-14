import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router, Instruction} from 'angular2/router';
import {IdentityService, Storage} from '../../services/services';

@Component({
    selector: 'app-header',
    template: require('./header.component.html'),
    directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES],
    styles: [require('!raw!./style.less')]
})
export class Header {
    isAuthenticated: boolean = false;
    shouldRedirect: boolean;
    constructor(private identity: IdentityService, private localStorage: Storage, private router: Router) {
        identity.identitySubject
            .subscribe((user) => {
                this.isAuthenticated = user.isAuthenticated();
            });
        this.router.subscribe((next) => {
            var instr = router.recognize(next).then((instruction: Instruction) => {
                this.shouldRedirect = !!instruction.component.routeData.data["secured"];
            })
        })
    }
    signOut() {
        this.localStorage.removeItem("authorizationData");
        this.identity.update(null);
        if (this.shouldRedirect) {
            this.router.navigate(["Home"]);
        }
    }
}
