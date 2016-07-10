import { Header } from './header/header';
import { SecureInput } from './securedInput/securedInput';
import { Alert } from './alert/alert';
import { DateSelector } from './dateSelector/dateSelector';

export * from './header/header';
export * from './securedInput/securedInput';
export * from './alert/alert';
export * from './dateSelector/dateSelector';

export var COMMON_COMPONENTS: Array<any> = [
    Header, SecureInput, Alert, DateSelector
];