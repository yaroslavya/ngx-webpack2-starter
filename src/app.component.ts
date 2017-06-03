import { Component } from "@angular/core";

import { EnvironmentDataService } from "./error-handler";

@Component({
    selector: "[app]",
    styles: [require("./app.scss")],
    host: {
        style: "height: 100%"
    },
    template: `
        <div class="root">            
            <div class="content">
                <router-outlet></router-outlet>
            </div>
        </div>                        
    `
})
export class AppComponent {

    constructor(
        private _envDataService: EnvironmentDataService
    ) {
        _envDataService.init();

        window.addEventListener("dragover", function (e: any) {
            e = e || event;
            e.preventDefault();
        }, false);

        window.addEventListener("drop", function (e: any) {
            e = e || event;
            e.preventDefault();
        }, false);
    }
}
