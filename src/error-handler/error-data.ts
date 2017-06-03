import { DebugContextData } from "./debug-context-data";
import ICtorArgs = ErrorData.ICtorArgs;

export class ErrorData {
    when: Date;

    originalError: Error;
    message: string;

    fileName: string;
    functionName: string;

    stackItems: Array<any>;
    ngContext: DebugContextData;

    /**
     * Create a new instance of the ErrorData by wrapping the js Error object or the ones inherited from it
     * Adds more details, such as when, urls, userActions etc.
     */
    constructor(data: ICtorArgs) {
        this.when = data.when || new Date();

        this.originalError = data.originalError;
        this.message = data.message || "";

        this.fileName = data.fileName || "unknown";
        this.functionName = data.functionName || "";

        this.stackItems = data.stackItems || [];
        this.ngContext = data.ngContext;
    }

}

export module ErrorData {
    export interface ICtorArgs {
        when?: Date;

        originalError: Error;
        message: string;

        fileName?: string;
        functionName?: string;

        stackItems?: Array<any>;
        ngContext?: DebugContextData;
    }
}
