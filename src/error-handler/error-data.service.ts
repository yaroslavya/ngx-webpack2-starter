import { ErrorData } from "./error-data";
import { Injectable } from "@angular/core";

/** Service is used to report the errors to and to get access to the reported errors
 * Errors are reported by the user by calling ErrorDataService.add(err:Error);
 */
@Injectable()
export class ErrorDataService {
    //NOTE: we can make it an observable, lets KISS it for now.
    errors: ErrorData[];

    constructor() {
        this.errors = [];
    }

    public add(error: ErrorData): void {
        this.errors.push(error);
    }

    public getAll(): ErrorData[] {
        return this.errors || [];
    }
}
