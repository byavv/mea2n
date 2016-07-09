import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import {AuthApiService} from "../services/authApi.service";

/** 
 * Authentication Component 
 */
@Component({
    selector: 'auth',
    directives: [ROUTER_DIRECTIVES],
    template: `
    <section>
      <router-outlet>
      </router-outlet>
    </section>
  `,
    providers: [AuthApiService]
})
export class AuthorizationBase {}


