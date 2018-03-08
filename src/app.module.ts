import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

/** Routes */
import { routing } from "./routes";

import * as CORE from "./core";

import { AppComponent } from "./app.component";

@NgModule({
    imports: [
        routing,
        BrowserModule,
        CommonModule,
        RouterModule,
        CORE.CoreModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
