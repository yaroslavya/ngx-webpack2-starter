import { Component } from "@angular/core";

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
    constructor() {}
}
