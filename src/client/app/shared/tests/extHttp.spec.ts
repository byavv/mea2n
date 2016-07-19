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
import { MockRouter } from './mocks';

var fakeStorageValue = { token: 'fakeToken' };
var _injector: Injector;
import {IdentityService, ExtHttp, ServerResponseHandler, APP_SERVICES_PROVIDERS} from "../services";



describe('Extended http tests', () => {
    beforeEachProviders(() => [
        APP_SERVICES_PROVIDERS,
        BaseRequestOptions,
        MockBackend,
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
        var responseHandler = injector.get(ServerResponseHandler);
        var identity = injector.get(IdentityService);
        spyOn(responseHandler, 'handleError').and.returnValue(null);
        identity.update(new User("supersecret"))
    }));

    it('should be created initialize', async(inject([ExtHttp], (extHttp: ExtHttp) => {
        expect(extHttp).toBeTruthy();
    })));

    it('should make get request', async(inject([ExtHttp], (extHttp: ExtHttp) => {
        var connection: MockConnection;
        var text;
        var backend = _injector.get(MockBackend);
        backend.connections.subscribe(c => connection = c);
        extHttp.get('something.json').subscribe(res => {
            expect(res).toEqual({ some: "test" });
        });
        connection.mockRespond(new Response(new ResponseOptions({ body: { some: "test" } })));
    })));

    it('should make post request and get responce', async(inject([ExtHttp], (extHttp: ExtHttp) => {
        var connection: MockConnection;
        var backend = _injector.get(MockBackend);
        backend.connections.subscribe(c => {
            connection = c;
            expect(connection.request.text()).toEqual(JSON.stringify({ some: 'request' }))
            connection.mockRespond(new Response(new ResponseOptions({ body: { some: "test" } })))
        });
        extHttp.post('/someapi', JSON.stringify({ some: 'request' }))
            .subscribe(res => {
                expect(res).toEqual({ some: "test" });
            });
    })));

    it('should handle server error', async(inject([ExtHttp, ServerResponseHandler], (extHttp: ExtHttp, responseHandler: ServerResponseHandler) => {
        var connection: MockConnection;
        var backend = _injector.get(MockBackend);
        backend.connections.subscribe(c => {
            connection = c;
            connection.mockError(new Error('SOMETHINGBAD'))
        });
        extHttp.post('/someapi', JSON.stringify({ some: 'request' }))
            .subscribe(res => { }, err => {
                expect(responseHandler.handleError).toHaveBeenCalled();
            });
    })));

    it('should not handle server error', async(inject([ExtHttp, ServerResponseHandler], (extHttp: ExtHttp, responseHandler: ServerResponseHandler) => {
        var connection: MockConnection;
        var backend = _injector.get(MockBackend);
        backend.connections.subscribe(c => {
            connection = c;
            connection.mockError(new Error('SOMETHINGBAD'))
        });
        extHttp.post('/someapi', JSON.stringify({ some: 'request' }), { handle: false })
            .subscribe(res => { }, err => {
                expect(err).toBeDefined();
                expect(responseHandler.handleError).not.toHaveBeenCalled();
            });
    })));

    it('should handle 401 error', async(inject([ExtHttp, ServerResponseHandler], (extHttp: ExtHttp, responseHandler: ServerResponseHandler) => {
        var connection: MockConnection;
        var backend = _injector.get(MockBackend);
        backend.connections.subscribe(c => {
            connection = c;
            connection.mockError(new UnauthorizedAccessError('Authorization failed'))
        });
        extHttp.post('/someapi', JSON.stringify({ some: 'request' }))
            .subscribe(res => { }, err => {
                expect(responseHandler.handleError).toHaveBeenCalled();
            });
    })));

    it('should handle 500 error', async(inject([ExtHttp, ServerResponseHandler], (extHttp: ExtHttp, responseHandler: ServerResponseHandler) => {
        var connection: MockConnection;
        var backend = _injector.get(MockBackend);
        backend.connections.subscribe(c => {
            connection = c;
            connection.mockError(new ServerError('Server down'))
        });
        extHttp.post('/someapi', JSON.stringify({ some: 'request' }))
            .subscribe(res => {
                expect(res).toBeUndefined();
            }, err => {
                expect(err).toBeDefined();
            });
        expect(responseHandler.handleError).toHaveBeenCalled()
    })));


    it('should set authorization headers', async(inject([ExtHttp, ServerResponseHandler], (extHttp: ExtHttp, responseHandler: ServerResponseHandler) => {
        var connection: MockConnection;
        var backend = _injector.get(MockBackend);
        backend.connections.subscribe(c => {
            connection = c;
            expect(connection.request.headers.get("Authorization")).toEqual('Bearer supersecret')
        });
        extHttp.post('/someapi', JSON.stringify({ some: 'request' }))
            .subscribe(res => {
                expect(res).toBeDefined();
            }, err => {
                expect(err).not.toBeDefined();
            });
    })));
})