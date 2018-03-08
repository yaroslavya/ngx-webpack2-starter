import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import * as LOGIN from "./login";

import { AuthGuard } from "./auth.guard";
import { EmptyComponent } from "./empty-component";

@NgModule({
    id: "CORE",
    imports: [
        CommonModule,
        FormsModule,
        RouterModule
    ],
    declarations: [LOGIN.Login, EmptyComponent ],
    exports: [LOGIN.Login ],
    providers: [LOGIN.LoginService, AuthGuard ]
})
export class CoreModule { }
