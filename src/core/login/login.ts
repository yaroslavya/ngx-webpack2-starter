import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";

@Component({
    selector: "[login]",
    styles: [require("./login.scss")],
    template: require("./login.html")
})
export class Login implements OnInit {
    @ViewChild("form") form: NgForm;

    username: string;
    password: string;
    partnerId: number;
    systemId: number;
    rememberMe: boolean;
    error: string = null;

    constructor(
        private _router: Router
    ) { }

    async ngOnInit(): Promise<void> {
    }

    async login(): Promise<void> {
        if (!this.form.valid) return;
        this.error = null;

        let credentials = {
            partnerId: this.partnerId,
            password: this.password,
            systemId: this.systemId,
            username: this.username
        };

        console.log("tried to login with these credentials:", credentials);
    }
}
