import { Route, RouterModule } from "@angular/router";
import { EmptyComponent, Login } from "./core";

const routes: Route[] = [
    {
        path: "login",
        component: Login
    },
    // this needs to be last
    { path: "**", component: EmptyComponent }
];

export const routing = RouterModule.forRoot(routes, { useHash: true });
