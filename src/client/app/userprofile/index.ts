import { AccountComponent } from './components/account/account.component';
import { PersonalComponent } from './components/personal/personal.component';
import { UserProfileBase } from './components/usersProfileBase';

export * from './components/account/account.component';
export * from './components/personal/personal.component';
export * from './components/usersProfileBase';
export * from './routes';

export var USERPROFILE_COMPONENTS = [
    AccountComponent,
    PersonalComponent,
    UserProfileBase
]
