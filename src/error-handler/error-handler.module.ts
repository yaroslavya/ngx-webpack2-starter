import { NgModule, ModuleWithProviders } from "@angular/core";

import { CustomErrorHandler } from "./custom-error-handler";
import { EnvironmentDataService } from "./env-data.service";
import { ErrorDataService } from "./error-data.service";
import { ErrorParser } from "./error-parser.service";

@NgModule({
    imports: [],
    declarations: [],
    exports: [],
    providers: [
        EnvironmentDataService,
        CustomErrorHandler,
        ErrorParser,
        ErrorDataService
    ]
})
export class ErrorHandlerModule {
    static forRoot(environmentDataService: any = {
        provide: EnvironmentDataService,
        useClass: EnvironmentDataService
    }): ModuleWithProviders {
        return {
            ngModule: ErrorHandlerModule,
            providers: [
                environmentDataService,
                CustomErrorHandler,
                ErrorParser,
                ErrorDataService
            ]
        };
    }
}
