import { RouterConfig } from '@angular/router';
import { PersonalComponent, AccountComponent, UserProfileBase } from './';
import { AuthGuard } from "../shared/routing/guards";

export const UserProfileRoutes: RouterConfig = [
    {
        path: 'user',
        component: UserProfileBase,
        data: { secured: true },
        children: [
            {
                path: 'personal',
                component: PersonalComponent,
                data: { permission: ["user"] },
                canActivate: [AuthGuard]
            },
            {
                path: 'account',
                component: AccountComponent,
                data: { permission: ["user"] },
                canActivate: [AuthGuard]
            }
        ]
    }
];
