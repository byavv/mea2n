import {FORM_DIRECTIVES, ControlGroup, FormBuilder} from '@angular/common';
import {Component, Injector} from '@angular/core';
import { Router, ROUTER_DIRECTIVES} from '@angular/router';
import {ServerResponseHandler, IdentityService, Storage} from '../../../common/services';
import {AuthApiService} from '../../services/authApi.service';
import {Alert} from '../../../common/components/alert/alert.component';

@Component({
    selector: 'signin',
    template: require('./signin.component.html'),
    directives: [FORM_DIRECTIVES, Alert, ROUTER_DIRECTIVES],
    styles: [require("./signin.scss")]
})
export class SignInComponent {
    signInForm: ControlGroup;
    error: string;
    constructor(builder: FormBuilder,
        private router: Router,
        private authService: AuthApiService,
        private storage: Storage,
        private identityService: IdentityService,
        private responseHandler: ServerResponseHandler) {
        this.signInForm = builder.group({
            "username": [""],
            "password": [""]
        });
    }

    onSubmit(value) {
        this.authService.signIn(value).subscribe(
            data => this.onSuccess(data),
            err => this.onError(err)
        );
    }

    /*  routerOnActivate() {
          if (this.identityService.user.isAuthenticated()) {
              this.router.navigate(['/Home']);
          }
      }
  */
    onSuccess(data) {
        if (data && data.token) {
            this.storage.setItem("authorizationData", JSON.stringify(data))
            this.identityService.update(data);
            this.router.navigate(['/Home']);
        } else {
            this.error = "Unexpected server error";
        }
    }

    onError(err) {
        this.error = this.responseHandler.handleError(err);
    }

    closeAlert() {
        this.error = null;
    }
}