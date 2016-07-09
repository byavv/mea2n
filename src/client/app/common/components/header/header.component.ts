import {CORE_DIRECTIVES, FORM_DIRECTIVES} from '@angular/common';
import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, NavigationStart} from '@angular/router';
import {IdentityService, Storage} from '../../services';

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
        identity.identityDispatch
            .subscribe((user) => {
                this.isAuthenticated = user.isAuthenticated();
            });

        this.router
            .events
            .subscribe((next) => {
             
                /*   var instr = router.recognize(next).then((instruction: Instruction) => {
                       this.shouldRedirect = !!instruction.component.routeData.data["secured"];
                   })*/
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
