import { NgModule, ErrorHandler } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { splitIntoModuleFriendly } from "./util";

/** Routes */
import { routing } from "./routes";

import * as CORE from "./core";

import { AppComponent } from "./app.component";
import { CustomErrorHandler, ErrorHandlerModule } from "./error-handler";

const ALL = splitIntoModuleFriendly([
    ...Object.values(CORE)
]);

@NgModule({
    imports: [
        routing,
        BrowserModule,
        CommonModule,
        RouterModule,
        ErrorHandlerModule.forRoot(),
        ...ALL.modules
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        { provide: ErrorHandler, useClass: CustomErrorHandler }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
