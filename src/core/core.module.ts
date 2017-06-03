import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { splitIntoModuleFriendly } from "../util";

import * as LOGIN from "./login";

import { AuthGuard } from "./auth.guard";
import { EmptyComponent } from "./empty-component";

const ALL = splitIntoModuleFriendly([
    ...Object.values(LOGIN)
]);

@NgModule({
    id: "CORE",
    imports: [
        CommonModule,
        FormsModule,
        RouterModule
    ],
    declarations: [...ALL.directives, EmptyComponent ],
    exports: [...ALL.directives ],
    providers: [...ALL.providers, AuthGuard ]
})
export class CoreModule { }
