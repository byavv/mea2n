import {Component, Renderer} from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {IdentityService} from "./common/services/services";
import {Header} from './common/components/header/header.component';
import {HomeComponent} from './modules/home/components/home.component';
import {UserProfileModule} from './modules/userprofile/users.module';
import {AuthorizationModule, AUTH_MODULE} from './modules/authorization/authorization.module';
import {RestrictedComponent} from './modules/restricted/components/restricted.component';
import {APP_SERVICES_PROVIDERS} from "./common/services/services";

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
  ` 
})
@RouteConfig([
    { path: '/', name: 'Home', component: HomeComponent, useAsDefault: true },
    { path: '/restricted', name: 'Restricted', component: RestrictedComponent, data: { secured: true } },
    { path: '/user/...', name: 'User', component: UserProfileModule, data: { secured: true } },
    { path: '/auth/...', name: 'Auth', component: AuthorizationModule, data: { secured: true } },
    { path: '/**', redirectTo: ['Home'] }
])
export class App {
    constructor(private identity: IdentityService, private renderer: Renderer, router: Router) {
        renderer.listenGlobal("window", "storage", (event) => {
            var identityData = JSON.parse(event.newValue);
            identity.update(identityData);
            router.navigate(['Home']);
        });
    }  
}