import { Component, Renderer } from '@angular/core';
import { Header } from './common/components/header/header.component';
import { APP_SERVICES_PROVIDERS, IdentityService, Storage } from "./common/services";
import { Router, ROUTER_DIRECTIVES } from "@angular/router";

import '../assets/styles/main.scss';

@Component({
    selector: 'app',
    directives: [ROUTER_DIRECTIVES, Header],
    template: `
    <div class='container-fluid'>
        <app-header>
        </app-header> 
        <section class="main-content">
            <router-outlet>
            </router-outlet>
        </section>        
    </div>
  ` ,
    providers: [APP_SERVICES_PROVIDERS]
})
export class App {
    constructor(private identity: IdentityService,
        private renderer: Renderer,
        router: Router,
        private storage: Storage) {
        identity.update(JSON.parse(storage.getItem("authorizationData")));
        renderer.listenGlobal("window", "storage", (event) => {
            var identityData = JSON.parse(event.newValue);
            identity.update(identityData);
            router.navigate(['/']);
        });
    }
}