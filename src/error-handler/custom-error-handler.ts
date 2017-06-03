import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { ErrorDataService } from "./error-data.service";
import { EnvironmentDataService } from "./env-data.service";
import { ErrorParser } from "./error-parser.service";

@Injectable()
export class CustomErrorHandler implements ErrorHandler {

    /**
     * We need the injector to be able to resolve the instances of the services in the handleError method
     * if we try to inject them immediately we will get an exception as they are not ready yet.
     *
     * @param injector - the injector that is used to resolved the services at runtime.
     * @param errorParser - parses the error so we could report the most precise results.
     */
    constructor(private injector: Injector, private errorParser: ErrorParser) {

    }

    /**
     * Handles error, by mostly parsing the details of the error and reporting it to console.
     *
     * @param error the error to be handled. Is of type any to be able to assume different properties
     * keeping the typescript compiler happy.
     */
    public handleError(error: any): void {
        try {
            let errorDataService: ErrorDataService = this.injector.get(ErrorDataService);
            let errData = this.errorParser.parse(error);

            errData["envData"] = this.getEnvData(error);

            errorDataService.add(errData);

            console.error(errData);
        } catch (e) {
            console.error("CustomErrorHandler->error occured while handling the exception:", e);
        }

    }

    private getEnvData(err: Error): any {
        let envData: EnvironmentDataService = this.injector.get(EnvironmentDataService);

        return envData.getEnvironmentData();
    }

}

