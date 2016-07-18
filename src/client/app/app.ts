import { Component, /*Renderer,*/ ViewContainerRef } from '@angular/core';
import { Header } from './shared/components';
import { IdentityService, Storage, AppController } from "./shared/services";
import { Router, ActivatedRoute, ROUTER_DIRECTIVES } from "@angular/router";

import '../assets/styles/main.scss';

@Component({
    selector: 'app',
    directives: [...ROUTER_DIRECTIVES, Header],
    template: `
    <div class="page-wrap">
        <app-header>
        </app-header>
        <div class='container-fluid'>             
            <div class="content-area" [hidden]='!loaded'>
                <router-outlet>
                </router-outlet>
            </div>        
        </div>
    </div>
  `
})
export class App {
    loaded: boolean = false;
    constructor(private appController: AppController,
        private identity: IdentityService,
      //  private renderer: Renderer,
      //  router: Router,
      //  activeRoute: ActivatedRoute,
        public viewContainerRef: ViewContainerRef, /* fix for ng2-bootstrap */
        private storage: Storage) {
         //   activeRoute.params.subscribe((params)=>{
        //        console.log(params)
        //    })
        // renderer.listenGlobal("window", "storage", (event) => {
        //     var identityData = JSON.parse(event.newValue);
        //     identity.update(identityData);
        //     const redirectUrl = activeRoute.snapshot.params['from'] || '/';
        //     console.log(activeRoute.snapshot)
        //     router.navigate([redirectUrl]);
        // });
    }
    ngOnInit() {
        this.appController.init$.subscribe(defaults => {
            console.log("APPLICATION STARTED");
            this.loaded = true;
        });
        this.appController.start();
        this.identity.update(JSON.parse(this.storage.getItem("authorizationData")));
    }
}
