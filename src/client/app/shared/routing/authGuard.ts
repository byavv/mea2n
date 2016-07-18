import { Injectable } from '@angular/core';
import { PermissionService, IdentityService } from '../services';
import { Observable, Observer } from "rxjs";
import {
    CanActivate,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private permService: PermissionService, private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        let permission = route.data["permission"] || ["user"];
        return Observable.create((observer: Observer<boolean>) => {
            this.permService
                .isAuthorized(permission)
                .map(res => res.json())
                .do(null, () => {
                    this.router.navigate(['/auth/signin', { from: state.url }]);
                })
                .subscribe(() => {
                    observer.next(true);
                    observer.complete();
                }, (err) => {
                    observer.next(false);
                    observer.complete();
                });
        });
    }
}
