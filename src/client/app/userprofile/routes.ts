import { RouterConfig } from '@angular/router';
import { PersonalComponent, AccountComponent, UserProfileBase } from './';

export const UserProfileRoutes: RouterConfig = [
    {
        path: 'user',
        component: UserProfileBase,
        data: { secured: true },
        children: [
            {
                path: 'personal',
                component: PersonalComponent
            },
            {
                path: 'account',
                component: AccountComponent
            }
        ]
    }
];
