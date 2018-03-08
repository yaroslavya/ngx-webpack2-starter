import { NgModule, ErrorHandler } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

/** Routes */
import { routing } from "./routes";

import * as CORE from "./core";

import { AppComponent } from "./app.component";
import { CustomErrorHandler, ErrorHandlerModule } from "./error-handler";

@NgModule({
    imports: [
        routing,
        BrowserModule,
        CommonModule,
        RouterModule,
        ErrorHandlerModule.forRoot(),
        CORE.CoreModule
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
