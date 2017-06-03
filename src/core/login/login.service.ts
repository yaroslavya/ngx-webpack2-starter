import { Injectable } from "@angular/core";

@Injectable()
export class LoginService {
    constructor() { }

    async login(args: {
        rememberMe: boolean;
    }): Promise<void> {
        console.log("login clicked");
        //TODO: do login stuff here.
    }
}
