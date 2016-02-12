import {provide, ApplicationRef, Component, PLATFORM_DIRECTIVES} from 'angular2/core';
import {FORM_PROVIDERS, FormBuilder} from 'angular2/common';
import {it, xit, describe, expect, afterEach, beforeEach, inject, MockApplicationRef, ComponentFixture, injectAsync, beforeEachProviders, TestComponentBuilder} from 'angular2/testing';
import {SignInComponent} from "../components/signin/signin.component";
import {AuthApiService} from "../services/authApi.service";
import {
IdentityService,
APP_SERVICES_PROVIDERS,
ServerResponseHandler}
from '../../../common/services/services';
import {setBaseTestProviders} from 'angular2/testing';
import {
TEST_BROWSER_PLATFORM_PROVIDERS,
TEST_BROWSER_APPLICATION_PROVIDERS
} from 'angular2/platform/testing/browser';

import {Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig, Location, LocationStrategy, ROUTER_PRIMARY_COMPONENT, RouteRegistry} from 'angular2/router';
import {PLATFORM_COMMON_PROVIDERS} from 'angular2/core'
import * as _ from 'lodash';
import * as rx from "rxjs/Rx";

import {ROUTER_LINK_DSL_PROVIDER} from 'angular2/router/router_link_dsl';

import * as locationMock from 'angular2/src/mock/location_mock';
import * as strategyMock from 'angular2/src/mock/mock_location_strategy';
import {RootRouter} from 'angular2/src/router/router';
import {App} from '../../../app';


setBaseTestProviders(TEST_BROWSER_PLATFORM_PROVIDERS,
    TEST_BROWSER_APPLICATION_PROVIDERS);

let externalAuthSpy: jasmine.Spy;

@Component({
    selector: 'test-cmp',
    directives: [SignInComponent],
    template: '<div><signin></signin></div>'
})
class TestComponent { }

let fake_signin_obj = { username: "John", password: "Doe" };
let fakeToken = { token: "The strongest token" };
describe('Authorization module tests', () => {

    class MockIdentityService {
        update() { }
    }
    class MockAuthService {
        signIn() { return rx.Observable.of(fakeToken) };
    }
    class MockRouter {
        navigate(value) { }
    }
    class MockResponseHandler {
        handleError(er) { return er.toString() }
    }

    var authSpy;
    describe("Signin component tests", () => {
        beforeEachProviders(() => [
            FORM_PROVIDERS,
            APP_SERVICES_PROVIDERS,
            provide(Router, { useFactory: () => new MockRouter() }),
            provide(IdentityService, { useFactory: () => new MockIdentityService() }),
            provide(AuthApiService, { useFactory: () => new MockAuthService() }),
            provide(ServerResponseHandler, { useClass: MockResponseHandler }),
        ]);

        beforeEach(inject([IdentityService, Router, AuthApiService], (identity, router, auth) => {
            authSpy = spyOn(auth, "signIn").and.callThrough();
            spyOn(identity, "update");
            spyOn(router, "navigate");
        }));
        beforeEach(inject([ServerResponseHandler], (responceHandler) => {
            spyOn(responceHandler, "handleError").and.callThrough();
        }));

        let component: any;
        beforeEach(injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .overrideTemplate(SignInComponent, "<div>{{error}}</div>")
                .createAsync(SignInComponent)
                .then(f => {
                    component = f.componentInstance;
                    spyOn(component, 'onSuccess').and.callThrough();
                    spyOn(component, 'onError').and.callThrough();
                });
        }));

        it("Should handle successful signin ", () => {
            component.onSubmit(fake_signin_obj);
            expect(component.authService.signIn).toHaveBeenCalledWith(fake_signin_obj);
            expect(component.onSuccess).toHaveBeenCalledWith(fakeToken);
        });

        it('Should update identity data', injectAsync([AuthApiService], (authService) => {
            component.onSubmit(fakeToken);
            return authService.signIn().toPromise().then((result) => {
                expect(result).toBe(fakeToken);
                expect(component.identityService.update).toHaveBeenCalledWith(fakeToken);
            });
        }));

        it('Should handle error respond', injectAsync([AuthApiService], (authService) => {
            authSpy.and.returnValue(rx.Observable.throw(401));
            component.onSubmit(fakeToken);
            return authService.signIn().toPromise().then((result) => {
            }, (err) => {
                expect(component.responseHandler.handleError).toHaveBeenCalledWith(401);
                expect(component.onError).toHaveBeenCalledWith(401);
            });
        }));

        it('Should show error message', injectAsync([AuthApiService, TestComponentBuilder], (authService, tcb: TestComponentBuilder) => {
            authSpy.and.returnValue(rx.Observable.throw(401));
            return tcb
                .createAsync(SignInComponent).then((fixture: ComponentFixture) => {
                    fixture.componentInstance.onSubmit(fakeToken);
                    fixture.detectChanges();
                    var compiled = fixture.debugElement.nativeElement;
                    expect(compiled.querySelector('div')).toHaveText('401');
                });
        }));
    });
});