import { Injectable, Injector } from "@angular/core";
import { Router, Event, RoutesRecognized } from "@angular/router";

@Injectable()
export class EnvironmentDataService {
    constructor(private injector: Injector) {

    }

    private _routerEvents: Event[] = [];
    private _urls: Array<string> = [];

    init(): void {
        let router = this.injector.get(Router);
        router.events.subscribe(event => {
            if (event instanceof RoutesRecognized) {
                this._urls.push(event.url);
            }

            this._routerEvents.push(event);
        });
    }

    /**
     *  returns the object filled with the current environment data
     *  currently it is the router data, user data and the console data.
     *  NOTE: we may need an options object to set the detalization level of env data.
     */
    getEnvironmentData(): any {
        let urlData = this.getUrlData();
        let userAgent = this.getUA();

        return {
            urls: urlData,
            ua: userAgent
        };
    }

    private getUrlData(): any {
        let last3Urls = this._urls.slice(-3);

        return { urls: last3Urls };
    }

    private getUA(): any {
        return navigator && navigator.userAgent;
    }
}
