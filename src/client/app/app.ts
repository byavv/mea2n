import { Component, Renderer, ViewContainerRef } from '@angular/core';
import { Header } from './common/components/header/header.component';
import { APP_SERVICES_PROVIDERS, IdentityService, Storage } from "./common/services";
import { Router, ROUTER_DIRECTIVES } from "@angular/router";

import '../assets/styles/main.scss';

@Component({
    selector: 'app',
    directives: [ROUTER_DIRECTIVES, Header],
    template: `
    <div class="page-wrap">
        <app-header>
        </app-header>
        <div class='container-fluid'>             
            <div class="content-area">
                <router-outlet>
                </router-outlet>
            </div>        
        </div>
    </div>
  ` ,
    providers: [/*APP_SERVICES_PROVIDERS*/]
})
export class App {
    constructor(private identity: IdentityService,
        private renderer: Renderer,
        router: Router,
        public viewContainerRef: ViewContainerRef,
        private storage: Storage) {
        identity.update(JSON.parse(storage.getItem("authorizationData")));
        renderer.listenGlobal("window", "storage", (event) => {
            var identityData = JSON.parse(event.newValue);
            identity.update(identityData);
            router.navigate(['/']);
        });
    }
}