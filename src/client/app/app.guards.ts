import { Injectable }          from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PermissionService }   from './common/services/permission';
import { Observable, Observer } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private permService: PermissionService, private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        let permission = route.data["permission"] || ["user"];
        return Observable.create((observer: Observer<boolean>) => {
            this.permService
                .isAuthorized(permission)
                .map(res => res.json())
                .subscribe(() => {
                    observer.next(true);
                    observer.complete();
                }, (err) => {
                    this.router.navigate(['/auth/signin']);
                    observer.error(err);
                })
        })
    }
}