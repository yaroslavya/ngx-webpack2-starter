import { Injectable } from "@angular/core";
import {
    Router,
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    RouterStateSnapshot
} from "@angular/router";
import { LoginService } from "./login";

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(
        private _router: Router,
        private _loginService: LoginService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return Promise.resolve(true);

    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return this.canActivate(route, state);
    }
}
