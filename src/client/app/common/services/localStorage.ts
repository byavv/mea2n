import {Inject, OpaqueToken, provide} from '@angular/core';
import {LocalStorage} from 'angular2-universal';
import {getDOM, DomAdapter} from '@angular/platform-browser/src/dom/dom_adapter';

export const localStorageBackend = new OpaqueToken('localStorageBackend');

export interface IStorageBackend {
    getItem(key: string): any;
    setItem(key: string, value: any): void;
    removeItem(key: string): void;
}


export class Storage {
    storageBackend: IStorageBackend;  

    constructor( @Inject(localStorageBackend) storageBackend: IStorageBackend) {
        this.storageBackend = storageBackend;     
    }

    getItem(key) {
        return this.storageBackend.getItem(key);
    }

    setItem(key, value) {
        return this.storageBackend.setItem(key, value);
    }

    removeItem(key) {
        return this.storageBackend.removeItem(key);
    }
    initStorage(backend) {
        this.storageBackend = backend;
    }
}

export const STORAGE_PROVIDERS = [
    Storage,
    provide(localStorageBackend, {
        useFactory() {           
            return getDOM().getGlobalEventTarget('window').localStorage || {
                getItem: (key) => { return null },
                setItem: (key, value) => { return null },
                removeItem: (key) => { return null }
            }
        }
    })
];