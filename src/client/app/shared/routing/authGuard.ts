import { Injectable } from "@angular/core";
import { PermissionService, IdentityService, Storage } from "../services";
import { Observable, Observer } from "rxjs";
import { isBoolean } from '@angular/compiler/src/facade/lang';
import {
    CanActivate,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from "@angular/router";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private permService: PermissionService, private router: Router, private identity: IdentityService, private storage: Storage) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        let permission = route.data["permission"] || ["user"];
        return Observable.create((observer: Observer<boolean>) => {
            this.permService
                .isAuthorized(permission)
                .toPromise()
                .then(result => {                    
                    isBoolean(result) ? observer.next(result) : observer.next(false);
                    observer.complete();
                })
                .catch((err) => {
                    observer.next(false);
                    observer.complete();
                    this.identity.update(null);
                    this.storage.removeItem("authorizationData");
                    this.router.navigate(["/auth/signin", { from: state.url }]);
                })
        });
    }
}
