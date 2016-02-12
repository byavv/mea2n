import {provide, Inject, OpaqueToken} from 'angular2/core';
import {PromiseWrapper} from "angular2/src/facade/async";

export interface StorageBackend {
    getItem(key: string): any;
    setItem(key: string, value: any): any;
    removeItem(key: string): any;
}

export class Storage {
    storageBackend: StorageBackend;
    getItem(key) {
        if (this.storageBackend) {
            return PromiseWrapper.wrap(() => this.storageBackend.getItem(key))
        } else {
            return PromiseWrapper.resolve("")
        }
    }

    setItem(key, value) {
        if (this.storageBackend) {
            return PromiseWrapper.wrap(() => this.storageBackend.setItem(key, value))
        } else {
            return PromiseWrapper.resolve("")
        }
    }

    removeItem(key) {
        if (this.storageBackend) {
            return PromiseWrapper.wrap(() => this.storageBackend.removeItem(key))
        } else {
            return PromiseWrapper.resolve("")
        }
    }
    // Init storage by DOM object outside of server rendering
    initStorage(storageBackend: StorageBackend) {
        this.storageBackend = storageBackend;
    }
}
