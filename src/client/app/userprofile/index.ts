import { AccountComponent } from './components/account/account';
import { PersonalComponent } from './components/personal/personal';
import { UserProfileBase } from './components/usersProfile.base';

export * from './components/account/account';
export * from './components/personal/personal';
export * from './components/usersProfile.base';
export * from './routes';

export var USERPROFILE_COMPONENTS = [
    AccountComponent,
    PersonalComponent,
    UserProfileBase
]
