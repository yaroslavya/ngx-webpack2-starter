/**
 * Data class representing a single stack step or a "call site" or a "stack frame"
 */
export class StackStep {
    functionName: string;
    fileName: string;
    source: string;

    columnNumber: number;
    lineNumber: number;

    args: Array<any>;

    origin: string;

    //TODO: reserved for future use. Corresponds to the standart V8 protocol for the stack trace.
    isConstructor: boolean;
    isEval: boolean;
    isNative: boolean;
    isTopLevel: boolean;

    constructor(data: StackStep.ICtorArgs) {
        this.functionName = data.functionName;
        this.fileName = data.fileName;
        this.source = data.source;

        this.columnNumber = data.columnNumber;
        this.lineNumber = data.lineNumber;
        this.args = data.args;
        this.origin = data.origin;
    }
}

export module StackStep {
    export interface ICtorArgs {
        functionName?: string;
        fileName?: string;
        source?: string;

        columnNumber?: number;
        lineNumber?: number;

        isConstructor?: boolean;
        isEval?: boolean;
        isNative?: boolean;
        isTopLevel?: boolean;

        args?: Array<any>;

        origin?: string;
    }
}
