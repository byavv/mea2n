import {ensureSsl} from './ensureSsl';
export * from './ensureSsl';

export var MIDDLEWARE = [
    ensureSsl
];