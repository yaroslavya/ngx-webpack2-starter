import { Component } from "@angular/core";
import { Route } from "@angular/router";

@Component({ selector: "empty", template: `` })
export class EmptyComponent { }

export const emptyRoute: Route = { path: "", component: EmptyComponent };
