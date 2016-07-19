import {
    beforeEachProviders,
    inject,
    async,
    it,   
    beforeEach, fakeAsync
} from '@angular/core/testing';

import { BaseRequestOptions, Http, Request, Response, ResponseOptions} from '@angular/http';
import { Router } from '@angular/router';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { provide, Injector } from '@angular/core';
import { Observable, ReplaySubject } from "rxjs";
import { User } from '../models/user.model';
import { UnauthorizedAccessError, ServerError } from './errors';

var _injector: Injector;
import {IdentityService, ExtHttp, ServerResponseHandler, AppController, BackEndApi, APP_SERVICES_PROVIDERS} from "../services";
import { MockRouter, MockAppController, MockApiService } from './mocks';

describe('App controller tests', () => {
    let apiBackEnd: BackEndApi;
    beforeEachProviders(() => [
        APP_SERVICES_PROVIDERS,
        BaseRequestOptions,
        MockBackend,
        provide(BackEndApi, { useClass: MockApiService }),
        provide(Router, { useFactory: () => new MockRouter() }),
        provide(Http, {
            useFactory: (backend, defaultOptions) => {
                return new Http(backend, defaultOptions);
            },
            deps: [MockBackend, BaseRequestOptions]
        })
    ]);
    beforeEach(inject([Injector], (injector) => {
        _injector = injector;
        apiBackEnd = injector.get(BackEndApi);
        spyOn(apiBackEnd, 'loadDefaults').and.returnValue([{ name: 'fake' }]);     
    }));

    it('should load defaults', async(inject([AppController], (appController: AppController) => {
        appController.start();
        appController.init$.subscribe((value) => {
            expect(apiBackEnd.loadDefaults).toHaveBeenCalled();           
        })
    })));   
})