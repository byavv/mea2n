import { Header } from './header/header.component';
import { SecureInput } from './securedInput/securedInput.component';
import { Alert } from './alert/alert.component';
import { DateSelector } from './dateSelector/dateSelector.component';

export * from './header/header.component';
export * from './securedInput/securedInput.component';
export * from './alert/alert.component';
export * from './dateSelector/dateSelector.component';

export var COMMON_COMPONENTS: Array<any> = [
    Header, SecureInput, Alert, DateSelector
];